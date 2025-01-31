import {
  ColumnFiltersState,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useMemo, useState } from "react";
import { fuzzyFilter } from "./fuzzyfilter";
import { TableColumnDef, TableData } from "./types";

type options = {
  data: TableData[];
  columns: TableColumnDef<TableData>[];
  refreshData: () => void;
};
export function useTable({ data, columns, refreshData }: options) {
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState("");

  const tableColumns = useMemo<TableColumnDef<TableData>[]>(() => columns, []);

  return {
    globalFilter,
    setGlobalFilter,
    refreshData,
    table: useReactTable({
      data,
      // data: tableData,
      columns: tableColumns,
      filterFns: {
        fuzzy: fuzzyFilter, //define as a filter function that can be used in column definitions
      },
      state: {
        columnFilters,
        globalFilter,
      },
      onColumnFiltersChange: setColumnFilters,
      onGlobalFilterChange: setGlobalFilter,
      globalFilterFn: "fuzzy", //apply fuzzy filter to the global filter (most common use case for fuzzy filter)
      getCoreRowModel: getCoreRowModel(),
      getFilteredRowModel: getFilteredRowModel(), //client side filtering
      getSortedRowModel: getSortedRowModel(),
      getPaginationRowModel: getPaginationRowModel(),
      debugTable: true,
      debugHeaders: true,
      debugColumns: false,
    }),
  };
}
