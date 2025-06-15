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
import EditStudentForm from "@/features/students-dashboard/edit-student-form/EditStudentForm";
import CreateAccountAndStudentsMultiStepForm from "@/features/students-dashboard/multistep-form/CreateAccountAndStudentsMultiStepForm";
import { ExpandedStudent } from "@/types/data/Student";
import { ExpandedTopic } from "@/types/data/Topic";
import { generateKey } from "@/utils/id";
import { Row } from "@tanstack/react-table";
import { useMemo } from "react";

type TopicsFilterTableProps = {
  topics: ExpandedTopic[];
  refetch: () => void;
};
export default function TopicsFilterTable({
  topics,
  refetch,
}: TopicsFilterTableProps) {
  const columns = useMemo<TableColumnDef<ExpandedTopic>[]>(
    () => [
      {
        accessorKey: "name",
        header: ({ table }) => <span>TOPIC</span>,
        filterFn: "equalsString", //note: normal non-fuzzy filter column - exact match required
      },
      {
        accessorFn: (row) => (
          <ConcatenatedLinksList links={row.subjects.map((s) => s.name)} />
        ),
        id: "subjects",
        header: ({ table }) => <span>SUBJECTS</span>,
        cell: ({ row, getValue }) => <div>{getValue<boolean>()}</div>,
        filterFn: "includesStringSensitive", //note: normal non-fuzzy filter column
      },
      {
        accessorFn: (row) => (
          <ConcatenatedLinksList links={["3"]} /> // TODO: replace with actual file links once ready
        ),
        id: "files",
        header: ({ table }) => <span>Files</span>,
        cell: ({ row, getValue }) => <div>{getValue<boolean>()}</div>,
        filterFn: "includesStringSensitive", //note: normal non-fuzzy filter column
      },
    ],
    [],
  );
  return (
    <div className='p-4'>
      <FilterTableRoot data={topics} columns={columns} refreshData={refetch}>
        <div className='flex justify-between items-center p-4 rounded-xl bg-white'>
          <GlobalFilterInput />
          <PaginationBar />
          <div className='flex justify-center items-center p-2 gap-2'>
            <DialogButton
              dialogFn={() => <CreateAccountAndStudentsMultiStepForm />} // TODO: replace
              dialogTitle={"Create Topics"}
              buttonTitle={"Create Topics"}
            />

            <RefreshDataButton />
          </div>
        </div>
        <FilterTableContentContainer>
          <FilterTableHeaders />
          <FilterTableContent
            editRowContent={(row: Row<ExpandedStudent>) => (
              <EditStudentForm student={row.original} /> // TODO: replace
            )}
          />
        </FilterTableContentContainer>
      </FilterTableRoot>
    </div>
  );
}
