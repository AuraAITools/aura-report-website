import DialogButton from "@/components/ui/buttons/dialogButton/DialogButton";
import { ConcatenatedLinksList } from "@/components/ui/ConcatenatedLinksListProps";
import { FilterTableContentContainer } from "@/features/filter-table/FilterTableContainer";
import { FilterTableContent } from "@/features/filter-table/FilterTableContent";
import { FilterTableHeaders } from "@/features/filter-table/FilterTableHeaders";
import { FilterTableRoot } from "@/features/filter-table/FilterTableRoot";
import GlobalFilterInput from "@/features/filter-table/GlobalFilterInput";
import { PaginationBar } from "@/features/filter-table/PaginationBar";
import RefreshDataButton from "@/features/filter-table/RefreshDataButton";
import { TableColumnDef } from "@/features/filter-table/types";
import { ExpandedStudent } from "@/types/data/Student";
import { generateKey } from "@/utils/id";
import { Row } from "@tanstack/react-table";
import { useMemo } from "react";
import EditStudentForm from "../edit-student-form/EditStudentForm";
import CreateAccountAndStudentsMultiStepForm from "../multistep-form/CreateAccountAndStudentsMultiStepForm";

type StudentsFilterTableProps = {
  students: ExpandedStudent[];
  refetch: () => void;
};
export default function StudentsFilterTable({
  students,
  refetch,
}: StudentsFilterTableProps) {
  const columns = useMemo<TableColumnDef<ExpandedStudent>[]>(
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
          <ConcatenatedLinksList links={row.courses.map((c) => c.name)} />
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
            {row.accounts.map((account, idx) => {
              return (
                <div key={generateKey("_account", account.id, idx.toString())}>
                  <p>{account.relationship}</p>
                  <p>{`${account.first_name} ${account.last_name}`} </p>
                  <p>{account.contact}</p>
                </div>
              );
            })}
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
              dialogFn={() => <CreateAccountAndStudentsMultiStepForm />}
              buttonTitle={"Create Students"}
            />

            <RefreshDataButton />
          </div>
        </div>
        <FilterTableContentContainer>
          <FilterTableHeaders />
          <FilterTableContent
            editRowContent={(row: Row<ExpandedStudent>) => (
              <EditStudentForm student={row.original} />
            )}
          />
        </FilterTableContentContainer>
      </FilterTableRoot>
    </div>
  );
}
