import { useState } from "react";
import { format, parse } from "date-fns";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { convertAmountToMiliunits } from "@/lib/utils";

import { ImportTable } from "./import-table";

const dateFormat = "yyyy-MM-dd HH:mm:ss";
const outputFormat = "yyyy-MM-dd";

const requireOptions = ["amount", "date", "payee"];

interface SelectedColumnsState {
  [key: string]: string | null;
}

type Props = {
  data: string[][];
  onCancel: () => void;
  onSubmit: (data: any) => void;
};

export const ImportCard = ({ data, onCancel, onSubmit }: Props) => {
  const [selectedColumns, setSelectedColumns] = useState<SelectedColumnsState>(
    {},
  );

  const headers = data[0];
  const body = data.slice(1);

  const onTableHeadSelectChange = (
    columnIndex: number,
    value: string | null,
  ) => {
    setSelectedColumns((prev) => {
      const newSelectedColumns = { ...prev };

      for (const key in newSelectedColumns) {
        if (newSelectedColumns[key] === value) {
          newSelectedColumns[key] = null;
        }
      }

      if (value === "skip") {
        value = null;
      }

      newSelectedColumns[`column_${columnIndex}`] = value;
      return newSelectedColumns;
    });
  };

  const progress = Object.values(selectedColumns).filter(Boolean).length;

  const handleContinue = () => {
    const getColumnIndex = (column: string) => {
      return column.split("_")[1];
    };

    const mappedData = {
      headers: headers.map((_header, index) => {
        const columnIndex = getColumnIndex(`column_${index}`);
        return selectedColumns[`column_${columnIndex}`] || null;
      }),

      body: body
        .map((row) => {
          const transformedRow = row.map((cell, index) => {
            const columnIndex = getColumnIndex(`column_${index}`);
            return selectedColumns[`column_${columnIndex}`] ? cell : null;
          });
          return transformedRow.every((item) => item === null)
            ? []
            : transformedRow;
        })
        .filter((row) => row.length > 0),
    };

    const arrayOfData = mappedData.body.map((row) => {
      return row.reduce((acc: any, cell, index) => {
        const header = mappedData.headers[index];
        if (header !== null) {
          acc[header] = cell;
        }

        return acc;
      }, {});
    });

    console.log("Raw data before formatting:", arrayOfData);

    const formattedData = arrayOfData.map((item) => {
      try {
        // Try to parse the date with multiple formats
        let parsedDate;
        const dateFormats = [
          "M/d/yyyy HH:mm",  // Added format for dates like "1/4/2025 20:18"
          "M/d/yyyy",
          "yyyy-MM-dd HH:mm:ss",
          "yyyy-MM-dd",
          "MM/dd/yyyy",
          "dd/MM/yyyy",
          "yyyy/MM/dd"
        ];

        for (const format of dateFormats) {
          try {
            parsedDate = parse(item.date, format, new Date());
            if (parsedDate.toString() !== "Invalid Date") {
              console.log(`Successfully parsed date ${item.date} with format ${format}`);
              break;
            }
          } catch (e) {
            console.log(`Failed to parse date ${item.date} with format ${format}`);
            continue;
          }
        }

        if (!parsedDate || parsedDate.toString() === "Invalid Date") {
          throw new Error(`Invalid date format: ${item.date}`);
        }

        const formattedItem = {
          ...item,
          amount: convertAmountToMiliunits(parseFloat(item.amount)),
          date: format(parsedDate, outputFormat),
        };

        console.log("Formatted item:", formattedItem);
        return formattedItem;
      } catch (error) {
        console.error("Error processing row:", error);
        return null;
      }
    }).filter(Boolean);

    console.log("Final formatted data:", formattedData);
    onSubmit(formattedData);
  };

  return (
    <div className="max-w-screen-2xl mx-auto -mt-24 pb-10 w-full">
      <Card className="border-none drop-shadow-sm">
        <CardHeader className="gap-y-2 lg:flex-row lg:items-center lg:justify-between">
          <CardTitle className="text-xl line-clamp-1">
            Transaction History
          </CardTitle>
          <div className="flex flex-col lg:flex-row gap-y-2 items-center gap-x-2">
            <Button size="sm" onClick={onCancel} className="w-full lg:w-auto">
              Cancel
            </Button>
            <Button
              size="sm"
              className="w-full lg:w-auto"
              disabled={progress < requireOptions.length}
              onClick={handleContinue}
            >
              Continue ({progress} / {requireOptions.length})
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <ImportTable
            headers={headers}
            body={body}
            selectedColumns={selectedColumns}
            onTableHeadSelectChange={onTableHeadSelectChange}
          />
        </CardContent>
      </Card>
    </div>
  );
};