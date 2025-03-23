import { generateKey } from "@/utils/id";
import { flexRender, Header, HeaderGroup } from "@tanstack/react-table";
import { useFilterTable } from "./FilterTableRoot";
import { TableData, TableValue } from "./types";
import { PropsWithChildren } from "react";

export function FilterTableHeaders() {
  const { table } = useFilterTable();
  return (
    <thead className={`bg-white rounded-xl`}>
      {table.getHeaderGroups().map((headerGroup, idx) => (
        <FilterTableHeaderGroup
          key={generateKey("_filter_table", idx.toString(), idx.toString())}
          headerGroup={headerGroup}
        />
      ))}
    </thead>
  );
}

type FilterHeaderGroupProps = {
  headerGroup: HeaderGroup<TableData>;
};
function FilterTableHeaderGroup({ headerGroup }: FilterHeaderGroupProps) {
  return (
    <tr key={headerGroup.id}>
      {headerGroup.headers.map((header) => (
        <FilterTableHeader key={header.id} header={header} />
      ))}
    </tr>
  );
}

type FilterTableHeaderProps = {
  header: Header<TableData, TableValue>;
};

function FilterTableHeader({ header }: FilterTableHeaderProps) {
  return (
    <th key={header.id} colSpan={header.colSpan} className='p-4 rounded-t-xl'>
      {!header.isPlaceholder && (
        <div
          className={`text-left text-l pl-6 ${header.column.getCanSort() && "cursor-pointer select-none"}`}
          onClick={header.column.getToggleSortingHandler()}
        >
          {flexRender(header.column.columnDef.header, header.getContext())}
          {{
            asc: " 🔼",
            desc: " 🔽", // to refactor
          }[header.column.getIsSorted() as string] ?? null}
        </div>
      )}
    </th>
  );
}
