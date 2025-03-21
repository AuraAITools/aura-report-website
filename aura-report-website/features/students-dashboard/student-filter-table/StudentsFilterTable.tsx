import DialogButton from "@/components/ui/buttons/dialogButton/DialogButton";
import { ConcatenatedLinksList } from "@/components/ui/ConcatenatedLinksListProps";
import { FilterTableContent } from "@/features/filter-table/FilterTableContent";
import { FilterTableHeaders } from "@/features/filter-table/FilterTableHeaders";
import { FilterTableRoot } from "@/features/filter-table/FilterTableRoot";
import GlobalFilterInput from "@/features/filter-table/GlobalFilterInput";
import { PaginationBar } from "@/features/filter-table/PaginationBar";
import RefreshDataButton from "@/features/filter-table/RefreshDataButton";
import { TableColumnDef } from "@/features/filter-table/types";
import { StudentWithAssociations } from "@/types/data/Student";
import { ReactNode, useMemo } from "react";
import MultiStepForm from "../multistep-form/MultiStepForm";
import { Row } from "@tanstack/react-table";
import EditStudentForm from "../edit-student-form/EditStudentForm";

type StudentsFilterTableProps = {
  students: StudentWithAssociations[];
  refetch: () => void;
};
export default function StudentsFilterTable({
  students,
  refetch,
}: StudentsFilterTableProps) {
  const columns = useMemo<TableColumnDef<StudentWithAssociations>[]>(
    () => [
      {
        accessorKey: "name",
        header: ({ table }) => <span>NAME</span>,
        filterFn: "equalsString", //note: normal non-fuzzy filter column - exact match required
      },
      {
        accessorKey: "level.name",
        header: ({ table }) => <span>LEVEL</span>,
        filterFn: "equalsString", //note: normal non-fuzzy filter column - exact match required
      },
      {
        accessorFn: (row) => (
          <ConcatenatedLinksList
            links={row.courses.map((c: { name: any }) => c.name)}
          />
        ),
        id: "courses",
        header: ({ table }) => <span>CLASSES ENROLLED</span>,
        cell: ({ row, getValue }) => <div>{getValue<boolean>()}</div>,
        filterFn: "includesStringSensitive", //note: normal non-fuzzy filter column
      },
      {
        accessorFn: (row) => (
          <ConcatenatedLinksList links={row.outlets.map((o) => o.name)} />
        ),
        id: "outlet",
        header: ({ table }) => <span>OUTLET(S)</span>,
        cell: ({ row, getValue }) => <div>{getValue<boolean>()}</div>,
        filterFn: "includesStringSensitive", //note: normal non-fuzzy filter column
      },
      {
        accessorFn: (row) => (
          <div>
            <p>{row.relationship}</p>
            <p>{row.name}</p>
            <p>{row.contact}</p>
          </div>
        ),
        id: "contact",
        header: ({ table }) => <span>CONTACT</span>,
        cell: ({ row, getValue }) => <div>{getValue<boolean>()}</div>,
        filterFn: "includesStringSensitive", //note: normal non-fuzzy filter column
      },
    ],
    [],
  );
  return (
    <div className='p-4'>
      <FilterTableRoot data={students} columns={columns} refreshData={refetch}>
        <div className='flex justify-between items-center p-4 rounded-xl bg-white'>
          <GlobalFilterInput />
          <PaginationBar />
          <div className='flex justify-center items-center p-2 gap-2'>
            <DialogButton
              dialog={<MultiStepForm />}
              buttonTitle={"Create Students"}
            />

            <RefreshDataButton />
          </div>
        </div>
        <div className='w-full my-4 rounded-xl bg-white p-4 '>
          <FilterTableHeaders />
          <FilterTableContent
            editRowContent={(row: Row<StudentWithAssociations>) => (
              <EditStudentForm student={row.original} />
            )}
          />
        </div>
      </FilterTableRoot>
    </div>
  );
}
