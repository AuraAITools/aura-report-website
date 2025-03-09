"use client";

import { useInstitutionAndOutletsContext } from "@/components/providers/InstitutionsAndOutletsProvider";
import DialogButton from "@/components/ui/buttons/dialogButton/DialogButton";
import ProgressBar from "@/components/ui/progress-bar/ProgressBar";
import CreateClassesForm from "@/features/classes-dashboard/create-courses-form/CreateCoursesForm";
import { FilterTableContent } from "@/features/filter-table/FilterTableContent";
import { FilterTableHeaders } from "@/features/filter-table/FilterTableHeaders";
import { FilterTableRoot } from "@/features/filter-table/FilterTableRoot";
import GlobalFilterInput from "@/features/filter-table/GlobalFilterInput";
import { PaginationBar } from "@/features/filter-table/PaginationBar";
import RefreshDataButton from "@/features/filter-table/RefreshDataButton";
import { TableColumnDef } from "@/features/filter-table/types";
import { CoursesApis } from "@/lib/hooks/courses-queries";
import { CourseWithAssociations } from "@/types/data/Course";
import { useMemo } from "react";

export default function ClassesPage() {
  const { currentInstitution, currentOutlet } =
    useInstitutionAndOutletsContext();
  const {
    data: classes,
    status,
    refetch,
  } = CoursesApis.useGetAllCoursesFromOutlet(
    currentInstitution?.id,
    currentOutlet?.id,
  );
  const columnDefs: TableColumnDef<CourseWithAssociations>[] = useMemo<
    TableColumnDef<CourseWithAssociations>[]
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
        accessorKey: "level",
        header: ({ table }) => <span>Level</span>,
        filterFn: "equalsString", //note: normal non-fuzzy filter column - exact match required
      },
      {
        accessorKey: "subject.name",
        header: ({ table }) => <span>Subject</span>,
        filterFn: "equalsString", //note: normal non-fuzzy filter column - exact match required
      },
    ],
    [],
  );

  if (status === "pending") {
    return <ProgressBar />;
  }

  if (status === "error") {
    throw new Error("Could not fetch classes data");
  }

  return (
    <div className='p-4'>
      <FilterTableRoot
        data={classes}
        columns={columnDefs}
        refreshData={refetch}
      >
        <div className='flex justify-between items-center p-4 rounded-xl bg-white'>
          <GlobalFilterInput />
          <PaginationBar />
          <div className='flex justify-center items-center p-2 gap-2'>
            <DialogButton
              dialog={<CreateClassesForm />}
              buttonTitle='Create Classes'
            />
            <RefreshDataButton />
          </div>
        </div>
        <div className='w-full my-4 rounded-xl bg-white p-4 '>
          <FilterTableHeaders />
          <FilterTableContent />
        </div>
      </FilterTableRoot>
    </div>
  );
}
