import { Table } from "@tanstack/react-table";
import { createContext, PropsWithChildren, useContext } from "react";
import { TableColumnDef, TableData } from "./types";
import { useTable } from "./useTable";

const FilterTableContext = createContext<
  | {
      globalFilter: string;
      setGlobalFilter: React.Dispatch<React.SetStateAction<string>>;
      refreshData: () => Promise<void>;
      table: Table<TableData>;
    }
  | undefined
>(undefined);

export type FilterTableRootProps = {
  data: TableData[];
  columns: TableColumnDef<TableData>[];
  refreshData: () => Promise<TableData[]>;
} & PropsWithChildren;

export function FilterTableRoot({
  children,
  data,
  columns,
  refreshData,
}: FilterTableRootProps) {
  const initialContext = useTable({ data, columns, refreshData });

  return (
    <FilterTableContext.Provider value={initialContext}>
      {children}
    </FilterTableContext.Provider>
  );
}

export function useFilterTable() {
  const ctx = useContext(FilterTableContext);
  if (!ctx) {
    throw new Error(
      "useFilterTable hook must be used within a FilterTableRoot",
    );
  }

  return ctx;
}
