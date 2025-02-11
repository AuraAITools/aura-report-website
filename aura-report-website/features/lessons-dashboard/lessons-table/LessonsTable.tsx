import { useInstitutionAndOutletsContext } from "@/components/providers/InstitutionsAndOutletsProvider";
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
        accessorKey: "status",
        header: ({ table }) => <span>STATUS</span>,
        filterFn: "equalsString", //note: normal non-fuzzy filter column - exact match required
      },
      {
        accessorFn: (row) => (
          <div>
            <p>{row.date}</p>
            <p>{row.day}</p>
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
        accessorFn: (row) => (
          <ConcatenatedLinksList links={row.educators.map((s) => s.name)} />
        ),
        id: "EDUCATORS",
        header: ({ table }) => <span>EDUCATORS</span>,
        cell: ({ row, getValue }) => <div>{getValue<boolean>()}</div>,
        filterFn: "includesStringSensitive", //note: normal non-fuzzy filter column
      },

      {
        accessorKey: "description",
        id: "DESCRIPTION",
        header: ({ table }) => <span>DESCRIPTION</span>,
        cell: ({ row, getValue }) => <div>{getValue<boolean>()}</div>,
        filterFn: "includesStringSensitive", //note: normal non-fuzzy filter column
      },
    ],
    [],
  );
  return (
    <div className='p-4'>
      <FilterTableRoot
        data={expandedLessons}
        columns={columns}
        refreshData={refetch}
      >
        <div className='flex justify-between bg-white p-4 rounded-xl'>
          <GlobalFilterInput />
          <PaginationBar />
          <RefreshDataButton />
        </div>
        <div className='w-full my-4 rounded-xl bg-white p-4 '>
          <FilterTableHeaders />
          <FilterTableContent />
        </div>
      </FilterTableRoot>
    </div>
  );
}
