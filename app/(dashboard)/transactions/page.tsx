"use client";
import { Loader2, Plus } from "lucide-react";
import { columns } from "./columns";
import { Button } from "@/components/ui/button";
import { useNewTransaction } from "@/features/transactions/hooks/use-new-transaction";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { useGetTransactions } from "@/features/transactions/api/use-get-transactions";
import { DataTable } from "@/components/data-table";
import { Skeleton } from "@/components/ui/skeleton";
import { useBulkDeleteTransactions } from "@/features/transactions/api/use-bulk-delete-transactions";
import { useState } from "react";
import { UploadButton } from "./upload-button";
import { ImportCard } from "./import-card";
import { transactions as transactionSchema } from "@/db/schema";
import { useSelectAccount } from "@/features/accounts/hooks/use-select-account";
import { toast } from "sonner";
import { useBulkCreateTransactions } from "@/features/transactions/api/use-bulk-create-transactions";

type Transaction = typeof transactionSchema.$inferInsert;

enum VARIANTS {
    LIST = "LIST",
    IMPORT = "IMPORT"
};

interface ImportResults {
    data: string[][];
    errors: any[];
    meta: any;
}

const INITIAL_IMPORT_RESULTS: ImportResults = { 
    data: [],
    errors: [],
    meta: {},
};

const TransactionsPage = () => {
    const [AccountDialog, confirm] = useSelectAccount();
    const [variant, setVariant] = useState<VARIANTS>(VARIANTS.LIST);
    const [importResults, setImportResults] = useState<ImportResults>(INITIAL_IMPORT_RESULTS);

    const onCancelImport = () => {
        setImportResults(INITIAL_IMPORT_RESULTS);
        setVariant(VARIANTS.LIST);
    }

    const onUpload = (data: string[][]) => {
        setImportResults({
            data: data,
            errors: [],
            meta: {},
        });
        setVariant(VARIANTS.IMPORT);
    };

    const newTransaction = useNewTransaction();
    const createTransactions = useBulkCreateTransactions();
    const transactionsQuery = useGetTransactions();
    const transactions = transactionsQuery.data || [];
    const deleteTransactions = useBulkDeleteTransactions();

    const isDisabled = 
        transactionsQuery.isLoading ||
        deleteTransactions.isPending;

    // FIX: Remove the return value to match ImportCard's expected type
    const onSubmitImport = async (formattedData: any[]) => {
        const accountId = await confirm();

        if (!accountId) {
            toast.error("Please select an account to continue.");
            return; // Just return void, don't return the toast
        }

        const values: Transaction[] = formattedData.map((item) => ({
            id: `temp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            date: new Date(item.date),
            amount: item.amount,
            payee: item.payee,
            accountId: accountId as string,
            notes: item.notes || "",
            categoryId: item.categoryId || null,
        }));

        createTransactions.mutate(values, {
            onSuccess: () => {
                onCancelImport();
            },
        });
    };

    if (transactionsQuery.isLoading) {
        return (
            <div className="max-w-screen-2xl mx-auto w-full pb-10 -mt-24">
                <Card className="border-none drop-shadow-sm">
                    <CardHeader>
                        <Skeleton className="h-8 w-48"/>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[500px] w-full flex items-center justify-center">
                            <Loader2 className="size-6 text-slate-300 animate-spin"/>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    if (variant === VARIANTS.IMPORT) {
        return (
            <>
                <AccountDialog />
                <ImportCard 
                    data={importResults.data}
                    onCancel={onCancelImport}
                    onSubmit={onSubmitImport}
                />
            </>
        );
    }

    return (
        <div className="max-w-screen-2xl mx-auto w-full pb-10 -mt-24">
            <Card className="border-none drop-shadow-sm">
                <CardHeader className="gap-y-2 lg:flex-row lg:items-center lg:justify-between">
                    <CardTitle className="text-xl line-clamp-1">
                        Transaction History
                    </CardTitle>
                    <div className="flex flex-col lg:flex-row gap-y-2 items-center gap-x-2">
                        <Button 
                            size="sm" 
                            onClick={newTransaction.onOpen}
                            className="w-full lg:w-auto"
                        >
                            <Plus className="size-4 mr-2"/>
                            Add new
                        </Button>
                        <UploadButton onUpload={onUpload} />
                    </div>
                </CardHeader>
                <CardContent>
                    <DataTable 
                        columns={columns} 
                        data={transactions} 
                        filterKey="payee"
                        onDelete={(row) => {
                            const ids = row.map((r) => r.original.id);
                            deleteTransactions.mutate({ ids });
                        }}
                        disabled={isDisabled} 
                    />
                </CardContent>
            </Card>
        </div>
    );
}

export default TransactionsPage;