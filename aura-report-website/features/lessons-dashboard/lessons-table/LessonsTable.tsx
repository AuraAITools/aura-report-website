import { useInstitutionAndOutletsContext } from "@/components/providers/InstitutionsAndOutletsProvider";
import DialogButton from "@/components/ui/buttons/dialogButton/DialogButton";
import { ConcatenatedLinksList } from "@/components/ui/ConcatenatedLinksListProps";
import { FilterTableContent } from "@/features/filter-table/FilterTableContent";
import { FilterTableHeaders } from "@/features/filter-table/FilterTableHeaders";
import { FilterTableRoot } from "@/features/filter-table/FilterTableRoot";
import GlobalFilterInput from "@/features/filter-table/GlobalFilterInput";
import { PaginationBar } from "@/features/filter-table/PaginationBar";
import RefreshDataButton from "@/features/filter-table/RefreshDataButton";
import { TableColumnDef } from "@/features/filter-table/types";
import { LessonsApis } from "@/lib/hooks/lessons-queries";
import { ExpandedLesson } from "@/types/data/Lesson";
import { useMemo } from "react";
import CreateLessonForm from "../create-lesson-form/CreateLessonForm";
import EditLessonDetailsForm from "../edit-lesson-form/EditLessonDetailsForm";
import { Row } from "@tanstack/react-table";
import { FilterTableContentContainer } from "@/features/filter-table/FilterTableContainer";
import { CircleIcon } from "@radix-ui/react-icons";

export default function LessonsTable() {
  const { currentInstitution, currentOutlet } =
    useInstitutionAndOutletsContext();
  const { data: expandedLessons = [], refetch } =
    LessonsApis.useGetAllLessonsOfOutlet(
      currentInstitution?.id,
      currentOutlet?.id,
    );

  const columns = useMemo<TableColumnDef<ExpandedLesson>[]>(
    () => [
      {
        accessorKey: "name",
        header: ({ table }) => <span>LESSON NAME</span>,
        filterFn: "equalsString", //note: normal non-fuzzy filter column - exact match required
      },
      {
        accessorFn: (row) => (
          <ConcatenatedLinksList links={[row.course.name]} />
        ),
        id: "courses",
        header: ({ table }) => <span>CLASSES ENROLLED</span>,
        cell: ({ row, getValue }) => <div>{getValue<boolean>()}</div>,
        filterFn: "includesStringSensitive", //note: normal non-fuzzy filter column
      },
      {
        accessorFn: (row) => (
          <div className='flex gap-2 items-center'>
            <CircleIcon className='fill-yellow-400 text-yellow-400' />
            {/* TODO: create a map of icons to each lesson status to dynamically generate the status row */}
            <p>{row.status}</p>
          </div>
        ),
        id: "status",
        header: ({ table }) => <span>STATUS</span>,
        cell: ({ row, getValue }) => <div>{getValue<boolean>()}</div>,
        filterFn: "equalsString", //note: normal non-fuzzy filter column - exact match required
      },
      {
        accessorFn: (row) => (
          <div>
            <p>{row.date}</p>
            <p>
              {row.start_time} - {row.end_time}
            </p>
          </div>
        ),
        id: "DATE_AND_TIME",
        header: ({ table }) => <span>DATE & TIME</span>,
        cell: ({ row, getValue }) => <div>{getValue<boolean>()}</div>,
        filterFn: "includesStringSensitive", //note: normal non-fuzzy filter column
      },
      {
        accessorFn: (row) => (
          <ConcatenatedLinksList links={row.students.map((s) => s.name)} />
        ),
        id: "STUDENTS",
        header: ({ table }) => <span>STUDENTS</span>,
        cell: ({ row, getValue }) => <div>{getValue<boolean>()}</div>,
        filterFn: "includesStringSensitive", //note: normal non-fuzzy filter column
      },
      {
        accessorFn: (row) => {
          return row.educators.length > 0 ? (
            <ConcatenatedLinksList links={row.educators.map((s) => s.name)} />
          ) : (
            <div>N/A</div>
          );
        },
        id: "EDUCATORS",
        header: ({ table }) => <span>EDUCATORS</span>,
        cell: ({ row, getValue }) => <div>{getValue<boolean>()}</div>,
        filterFn: "includesStringSensitive", //note: normal non-fuzzy filter column
      },

      {
        accessorFn: (row) => <span>{row.description || "N/A"}</span>,
        id: "DESCRIPTION",
        header: ({ table }) => <span>DESCRIPTION</span>,
        cell: ({ row, getValue }) => <div>{getValue<boolean>()}</div>,
        filterFn: "includesStringSensitive", //note: normal non-fuzzy filter column
      },
    ],
    [],
  );

  const renderEditLessonForm = (row: Row<ExpandedLesson>) => {
    return <EditLessonDetailsForm lesson={row.original} />;
  };
  return (
    <div className='p-4'>
      <FilterTableRoot
        data={expandedLessons}
        columns={columns}
        refreshData={refetch}
      >
        <div className='flex justify-between items-center p-4 rounded-xl bg-white'>
          <GlobalFilterInput />
          <PaginationBar />
          <div className='flex justify-center items-center p-2 gap-2'>
            <DialogButton
              dialog={<CreateLessonForm />}
              buttonTitle={"Create Lesson"}
            />
            <RefreshDataButton />
          </div>
        </div>
        <FilterTableContentContainer>
          <FilterTableHeaders />
          <FilterTableContent editRowContent={renderEditLessonForm} />
        </FilterTableContentContainer>
      </FilterTableRoot>
    </div>
  );
}
