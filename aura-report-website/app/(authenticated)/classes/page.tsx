"use client";

import { useInstitutionAndOutletsContext } from "@/components/providers/InstitutionsAndOutletsProvider";
import DialogButton from "@/components/ui/buttons/dialogButton/DialogButton";
import { ConcatenatedLinksList } from "@/components/ui/ConcatenatedLinksListProps";
import CreateClassesForm from "@/features/classes-dashboard/create-courses-form/CreateCoursesForm";
import FilterTableCellPopOver from "@/features/filter-table/FilterTableCellPopover";
import { FilterTableContentContainer } from "@/features/filter-table/FilterTableContainer";
import { FilterTableContent } from "@/features/filter-table/FilterTableContent";
import { FilterTableHeaders } from "@/features/filter-table/FilterTableHeaders";
import { FilterTableRoot } from "@/features/filter-table/FilterTableRoot";
import GlobalFilterInput from "@/features/filter-table/GlobalFilterInput";
import { PaginationBar } from "@/features/filter-table/PaginationBar";
import RefreshDataButton from "@/features/filter-table/RefreshDataButton";
import { TableColumnDef } from "@/features/filter-table/types";
import { CoursesApis } from "@/lib/hooks/courses-queries";
import { ExpandedCourse } from "@/lib/requests/courses";
import { BaseLesson } from "@/types/data/Lesson";
import { Row } from "@tanstack/react-table";
import { ReactNode, useMemo } from "react";

export default function ClassesPage() {
  const { currentInstitution, currentOutlet } =
    useInstitutionAndOutletsContext();
  const {
    data: classes,
    status,
    refetch,
  } = CoursesApis.useGetAllExpandedCoursesFromOutlet(
    currentInstitution?.id,
    currentOutlet?.id,
  );
  const columnDefs: TableColumnDef<ExpandedCourse>[] = useMemo<
    TableColumnDef<ExpandedCourse>[]
  >(
    () => [
      {
        accessorKey: "name",
        header: ({ table }) => <span>Name</span>,
        filterFn: "equalsString", //note: normal non-fuzzy filter column - exact match required
      },
      {
        accessorKey: "start_date",
        header: ({ table }) => <span>Start Date</span>,
        filterFn: "equalsString", //note: normal non-fuzzy filter column - exact match required
      },
      {
        accessorKey: "end_date",
        header: ({ table }) => <span>End Date</span>,
        filterFn: "equalsString", //note: normal non-fuzzy filter column - exact match required
      },
      {
        accessorKey: "start_time",
        header: ({ table }) => <span>Start Time</span>,
        filterFn: "equalsString", //note: normal non-fuzzy filter column - exact match required
      },
      {
        accessorKey: "lesson_number_frequency",
        header: ({ table }) => <span>Frequency</span>,
        cell: ({ cell, row }) => <div>{cell.getValue()}</div>,
        filterFn: "equalsString", //note: normal non-fuzzy filter column - exact match required
      },
      {
        accessorKey: "lesson_weekly_frequency",
        header: ({ table }) => <span>weekly Frequency</span>,
        cell: ({ cell, row }) => <div>{cell.getValue()}</div>,
        filterFn: "equalsString", //note: normal non-fuzzy filter column - exact match required
      },
      {
        accessorKey: "outlet.name",
        header: ({ table }) => <span>Outlet</span>,
        filterFn: "equalsString", //note: normal non-fuzzy filter column - exact match required
      },
      {
        accessorKey: "level.name",
        header: ({ table }) => <span>Level</span>,
        filterFn: "equalsString", //note: normal non-fuzzy filter column - exact match required
      },
      {
        accessorFn: (row) => (
          <ConcatenatedLinksList links={row.subjects.map((sub) => sub.name)} />
        ),
        id: "subjects",
        header: ({ table }) => <span>Subject</span>,
        cell: ({ row, getValue }) => <div>{getValue<boolean>()}</div>,
        filterFn: "equalsString", //note: normal non-fuzzy filter column - exact match required
      },
      {
        accessorFn: (row) => row.lessons, //note: normal non-fuzzy filter column - case sensitive
        id: "lessons",
        header: ({ table }) => <span>Lesson(s)</span>,
        cell: ({ row, cell }) => {
          let items = (cell.getValue() as BaseLesson[]).map((lesson) => {
            return {
              ...lesson,
              url: `/lessons/${lesson.id}`,
            };
          });
          return (
            <FilterTableCellPopOver
              title='Lessons'
              items={items}
              footerNav={{ title: "Manage", url: "/lessons" }}
            />
          );
        },
        filterFn: "equalsString", //note: normal non-fuzzy filter column - exact match required
      },
    ],
    [],
  );

  if (status === "error") {
    throw new Error("Could not fetch classes data");
  }

  return (
    <div className='p-4'>
      <FilterTableRoot
        data={classes ?? []}
        columns={columnDefs}
        refreshData={refetch}
      >
        <div className='flex justify-between items-center p-4 rounded-xl bg-white'>
          <GlobalFilterInput />
          <PaginationBar />
          <div className='flex justify-center items-center p-2 gap-2'>
            <DialogButton
              dialogFn={(onSuccess) => (
                <CreateClassesForm onSuccess={onSuccess} />
              )}
              buttonTitle='Create Classes'
            />
            <RefreshDataButton />
          </div>
        </div>
        <FilterTableContentContainer>
          <FilterTableHeaders />
          {/* TODO: implement */}
          <FilterTableContent />
        </FilterTableContentContainer>
      </FilterTableRoot>
    </div>
  );
}
