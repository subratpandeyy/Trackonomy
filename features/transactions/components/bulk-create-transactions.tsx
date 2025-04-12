import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useBulkCreateTransactions } from "../api/use-bulk-create-transactions";
import { BulkCreateTransactionsForm } from "./bulk-create-transactions-form";

export const BulkCreateTransactions = () => {
  const { mutate, isPending } = useBulkCreateTransactions();

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Bulk Create</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Bulk Create Transactions</DialogTitle>
          <DialogDescription>
            Create multiple transactions at once by uploading a CSV file.
          </DialogDescription>
        </DialogHeader>
        <BulkCreateTransactionsForm onSubmit={mutate} isPending={isPending} />
      </DialogContent>
    </Dialog>
  );
}; 