import { flexRender, Row } from "@tanstack/react-table";
import { useFilterTable } from "./FilterTableRoot";
import SideSlideOverlay from "@/components/ui/overlay/side-overlay/SideSlideOverlay";
import { ReactNode } from "react";
import { DotsVerticalIcon } from "@radix-ui/react-icons";
export type FilterTableContentProps = {
  editRowContent?: (row: Row<any>) => ReactNode;
};
export function FilterTableContent({
  editRowContent,
}: FilterTableContentProps) {
  const { table } = useFilterTable();

  return (
    <tbody>
      {table.getRowModel().rows.map((row) => {
        return (
          <tr key={row.id}>
            {row.getVisibleCells().map((cell) => (
              <td key={cell.id} className='p-4'>
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </td>
            ))}
            {!!editRowContent && (
              <td>
                <SideSlideOverlay
                  content={editRowContent(row)}
                  triggerButton={
                    <DotsVerticalIcon className='text-black hover:scale-125' />
                  }
                />
              </td>
            )}
          </tr>
        );
      })}
    </tbody>
  );
}
