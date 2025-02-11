import { generateKey } from "@/utils/id";
import { flexRender, Header, HeaderGroup } from "@tanstack/react-table";
import { useFilterTable } from "./FilterTableRoot";
import { TableData, TableValue } from "./types";

export function FilterTableHeaders() {
  const { table } = useFilterTable();
  const headerGroupsNumber = table.getHeaderGroups.length;
  return (
    <thead className={`grid-${headerGroupsNumber} w-full`}>
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
  const headerNumber = headerGroup.headers.length;

  return (
    <tr key={headerGroup.id} className={`col-span-1 grid-col-${headerNumber}`}>
      {headerGroup.headers.map((header, idx) => (
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
    <th key={header.id} colSpan={header.colSpan} className='col-span-1 p-4'>
      {!header.isPlaceholder && (
        <>
          <div
            {...{
              className: header.column.getCanSort()
                ? "cursor-pointer select-none"
                : "",
              onClick: header.column.getToggleSortingHandler(),
            }}
          >
            {flexRender(header.column.columnDef.header, header.getContext())}
            {{
              asc: " 🔼",
              desc: " 🔽", // to refactor
            }[header.column.getIsSorted() as string] ?? null}
          </div>
        </>
      )}
    </th>
  );
}
