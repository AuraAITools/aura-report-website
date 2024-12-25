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
  refreshData: () => Promise<TableData[]>;
};
export function useTable({ data, columns, refreshData }: options) {
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState("");

  const [tableData, setTableData] = useState<TableData[]>(data);
  const tableColumns = useMemo<TableColumnDef<TableData>[]>(() => columns, []);
  // const refreshData = () => setTableData((_old) => makeLevelData(1_000)); //stress test

  async function refreshDataWithUpdate() {
    let refreshedData = await refreshData();
    setTableData((_old) => refreshedData);
  }
  return {
    globalFilter,
    setGlobalFilter,
    refreshData: refreshDataWithUpdate,
    table: useReactTable({
      data: tableData,
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
