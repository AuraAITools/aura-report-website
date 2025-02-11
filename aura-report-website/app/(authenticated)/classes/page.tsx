"use client";

import { useInstitutionAndOutletsContext } from "@/components/providers/InstitutionsAndOutletsProvider";
import ProgressBar from "@/components/ui/progress-bar/ProgressBar";
import CreateClassesForm from "@/features/classes-dashboard/CreateCoursesForm";
import { FilterTableContent } from "@/features/filter-table/FilterTableContent";
import { FilterTableHeaders } from "@/features/filter-table/FilterTableHeaders";
import { FilterTableRoot } from "@/features/filter-table/FilterTableRoot";
import GlobalFilterInput from "@/features/filter-table/GlobalFilterInput";
import { PaginationBar } from "@/features/filter-table/PaginationBar";
import RefreshDataButton from "@/features/filter-table/RefreshDataButton";
import { TableColumnDef } from "@/features/filter-table/types";
import { CoursesApis } from "@/lib/hooks/courses-queries";
import { CourseWithAssociations } from "@/types/data/Course";
import * as Dialog from "@radix-ui/react-dialog";
import { Cross2Icon } from "@radix-ui/react-icons";
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
        <div className='flex justify-between items-center bg-white p-4 rounded-xl'>
          <GlobalFilterInput />
          <PaginationBar />
          <CreateClassButton />
          <RefreshDataButton />
        </div>
        <FilterTableHeaders />
        <FilterTableContent />
      </FilterTableRoot>
      <CreateClassesForm />
    </div>
  );
}

function CreateClassButton() {
  return (
    <Dialog.Root>
      <Dialog.Trigger className='bg-orange-300 rounded-md hover:bg-orange-400 text-white p-2 '>
        <button>Create</button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className='fixed inset-0 bg-gray-300 opacity-50' />
        <Dialog.Content className='fixed flex flex-col left-1/2 top-1/2 max-h-[85vh] w-[90vw] -translate-x-1/2 -translate-y-1/2 rounded-md bg-white p-[25px] shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none overflow-auto'>
          <CloseDialogButton />
          <CreateClassesForm />
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

function CloseDialogButton() {
  return (
    <Dialog.Close asChild>
      <button
        className='absolute right-2.5 top-2.5 inline-flex size-[25px] appearance-none items-center justify-center rounded-full text-black hover:bg-violet4 focus:shadow-[0_0_0_2px] focus:shadow-violet7 focus:outline-none'
        aria-label='Close'
      >
        <Cross2Icon className='size-6' />
      </button>
    </Dialog.Close>
  );
}
