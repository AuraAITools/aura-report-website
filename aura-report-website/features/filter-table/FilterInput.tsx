import DebouncedInput from "@/components/forms/DebouncedInput";
import { Column } from "@tanstack/react-table";
import { TableData, TableValue } from "./types";

type FilterInputProps = {
  column: Column<TableData, TableValue>;
  className?: string;
};

export function FilterInput({ column, className }: FilterInputProps) {
  const columnFilterValue = column.getFilterValue();

  return (
    <DebouncedInput
      type='text'
      value={(columnFilterValue ?? "") as string}
      onChange={(value) => column.setFilterValue(value)}
      placeholder={`Search...`}
      className={`w-36 border shadow rounded ${className}`}
    />
  );
}
