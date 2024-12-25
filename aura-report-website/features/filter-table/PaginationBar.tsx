import {
  ChevronLeftIcon,
  ChevronRightIcon,
  DoubleArrowLeftIcon,
  DoubleArrowRightIcon,
} from "@radix-ui/react-icons";
import { useFilterTable } from "./FilterTableRoot";

export function PaginationBar() {
  const { table } = useFilterTable();

  return (
    <div className='flex items-center gap-2'>
      <button
        className={`flex rounded p-1 hover:bg-orange-400 text-white size-8 items-center justify-center ${!table.getCanPreviousPage() ? "pointer-events-none bg-gray-200" : "bg-orange-300"}`}
        onClick={() => table.setPageIndex(0)}
        disabled={!table.getCanPreviousPage()}
      >
        <DoubleArrowLeftIcon />
      </button>
      <button
        className={`flex rounded p-1 hover:bg-orange-400 text-white size-8 items-center justify-center ${!table.getCanPreviousPage() ? "pointer-events-none bg-gray-200" : "bg-orange-300"}`}
        onClick={() => table.previousPage()}
        disabled={!table.getCanPreviousPage()}
      >
        <ChevronLeftIcon />
      </button>
      <button
        className={`flex rounded p-1 hover:bg-orange-400 text-white size-8 items-center justify-center ${!table.getCanNextPage() ? "pointer-events-none bg-gray-200" : "bg-orange-300"}`}
        onClick={() => table.nextPage()}
        disabled={!table.getCanNextPage()}
      >
        <ChevronRightIcon />
      </button>
      <button
        className={`flex rounded p-1 hover:bg-orange-400 text-white size-8 items-center justify-center ${!table.getCanNextPage() ? "pointer-events-none bg-gray-200" : "bg-orange-300"}`}
        onClick={() => table.setPageIndex(table.getPageCount() - 1)}
        disabled={!table.getCanNextPage()}
      >
        <DoubleArrowRightIcon />
      </button>
      <span className='flex items-center gap-1'>
        <div>Page</div>
        <strong>
          {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
        </strong>
      </span>
      <span className='flex items-center gap-1'>
        | Go to page:
        <input
          type='number'
          defaultValue={table.getState().pagination.pageIndex + 1}
          onChange={(e) => {
            const page = e.target.value ? Number(e.target.value) - 1 : 0;
            table.setPageIndex(page);
          }}
          className='border p-1 rounded w-16'
        />
      </span>
      <select
        value={table.getState().pagination.pageSize}
        onChange={(e) => {
          table.setPageSize(Number(e.target.value));
        }}
      >
        {[10, 20, 30, 40, 50].map((pageSize) => (
          <option key={pageSize} value={pageSize}>
            Show {pageSize}
          </option>
        ))}
      </select>
      <div className='text-orange-400'>
        {table.getPrePaginationRowModel().rows.length} rows{" "}
      </div>
    </div>
  );
}
