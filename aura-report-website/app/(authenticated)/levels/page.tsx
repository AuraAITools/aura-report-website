"use client";

import { ConcatenatedLinksList } from "@/components/ui/ConcatenatedLinksListProps";
import ProgressBar from "@/components/ui/progress-bar/ProgressBar";
import FilterTableCellPopOver from "@/features/filter-table/FilterTableCellPopover";
import { FilterTableContent } from "@/features/filter-table/FilterTableContent";
import { FilterTableHeaders } from "@/features/filter-table/FilterTableHeaders";
import { FilterTableRoot } from "@/features/filter-table/FilterTableRoot";
import GlobalFilterInput from "@/features/filter-table/GlobalFilterInput";
import { PaginationBar } from "@/features/filter-table/PaginationBar";
import RefreshDataButton from "@/features/filter-table/RefreshDataButton";
import { TableColumnDef } from "@/features/filter-table/types";
import useGetAllLevels from "@/lib/hooks/useLevels";
import { BaseCourse } from "@/types/data/Course";
import { BaseEducator } from "@/types/data/Educator";
import { LevelWithAssociations } from "@/types/data/Level";
import { BaseStudent } from "@/types/data/Student";
import { useMemo } from "react";

export default function LevelsPage() {
  const { data: levelsData, status, refetch } = useGetAllLevels();

  const columns = useMemo<TableColumnDef<LevelWithAssociations>[]>(
    () => [
      {
        accessorKey: "name",
        header: ({ table }) => <span>LEVELS</span>,
        filterFn: "equalsString", //note: normal non-fuzzy filter column - exact match required
      },
      {
        accessorFn: (row) => (
          <ConcatenatedLinksList
            links={row.subjects.map((sub) => {
              console.log(JSON.stringify(sub));
              return sub.name;
            })}
          />
        ),
        id: "subjects",
        header: ({ table }) => <span>SUBJECTS</span>,
        cell: ({ row, getValue }) => <div>{getValue<boolean>()}</div>,
        filterFn: "includesStringSensitive", //note: normal non-fuzzy filter column
      },
      {
        accessorFn: (row) => row.courses, //note: normal non-fuzzy filter column - case sensitive
        id: "courses",
        cell: ({ row, cell }) => {
          let items = (cell.getValue() as BaseCourse[]).map((course) => {
            return {
              ...course,
              url: `/courses/${course.id}`,
            };
          });
          return (
            <FilterTableCellPopOver
              title='CLASSES'
              items={items}
              footerNav={{ title: "Manage", url: "/courses" }}
            />
          );
        },
        header: ({ table }) => {
          return <span>CLASSES</span>;
        },
        filterFn: "includesString", //note: normal non-fuzzy filter column - case insensitive
      },
      {
        accessorFn: (row) => row.students, //note: normal non-fuzzy filter column - case sensitive
        id: "students",
        cell: ({ row, cell }) => {
          let items = (cell.getValue() as BaseStudent[]).map((student) => {
            return {
              ...student,
              url: `/students/${student.id}`,
            };
          });
          return (
            <FilterTableCellPopOver
              title='STUDENTS'
              items={items}
              footerNav={{ title: "Manage", url: "/students" }}
            />
          );
        },
        header: () => <span>STUDENTS</span>,
        filterFn: "includesString", //note: normal non-fuzzy filter column - case insensitive
      },
      {
        accessorFn: (row) => row.educators, //note: normal non-fuzzy filter column - case sensitive
        id: "educators",
        cell: ({ row, cell }) => {
          let items = (cell.getValue() as BaseEducator[]).map((educator) => {
            return {
              ...educator,
              url: `/educators/${educator.id}`,
            };
          });
          return (
            <FilterTableCellPopOver
              title='EDUCATORS'
              items={items}
              footerNav={{ title: "Manage", url: "/educators" }}
            />
          );
        },
        header: () => <span>EDUCATORS</span>,
        filterFn: "includesString", //note: normal non-fuzzy filter column - case insensitive
      },
      // {
      //   accessorFn: (row) => `${row.firstName} ${row.lastName}`,
      //   id: "fullName",
      //   header: "Full Name",
      //   cell: (info) => info.getValue(),
      //   filterFn: "fuzzy", //using our custom fuzzy filter function
      //   // filterFn: fuzzyFilter, //or just define with the function
      //   sortingFn: fuzzySort, //sort by fuzzy rank (falls back to alphanumeric)
      // },
    ],
    [],
  );

  if (status === "pending") {
    return <ProgressBar />;
  }

  if (status === "error") {
    throw new Error("Could not fetch levels data");
  }

  return (
    <div className='p-4'>
      <FilterTableRoot
        data={levelsData}
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
