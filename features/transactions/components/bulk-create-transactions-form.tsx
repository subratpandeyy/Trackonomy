import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRef, useState } from "react";
import Papa from "papaparse";

interface Transaction {
  date: Date;
  accountId: string;
  amount: number;
  payee: string;
  notes?: string | null;
  categoryId?: string | null;
}

interface BulkCreateTransactionsFormProps {
  onSubmit: (data: Transaction[]) => void;
  isPending: boolean;
}

export const BulkCreateTransactionsForm = ({
  onSubmit,
  isPending,
}: BulkCreateTransactionsFormProps) => {
  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    Papa.parse(file, {
      complete: (results) => {
        const transactions = results.data.slice(1).map((row: any) => ({
          date: new Date(row[0]),
          accountId: row[1],
          amount: parseFloat(row[2]),
          payee: row[3],
          notes: row[4] || null,
          categoryId: row[5] || null,
        }));
        onSubmit(transactions);
      },
      header: false,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Input
          ref={fileInputRef}
          type="file"
          accept=".csv"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          className="cursor-pointer"
        />
        <p className="text-sm text-muted-foreground">
          Upload a CSV file with your transactions
        </p>
      </div>
      <Button type="submit" disabled={!file || isPending}>
        {isPending ? "Uploading..." : "Upload"}
      </Button>
    </form>
  );
}; 