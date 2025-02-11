import Authorization from "@/components/providers/Authorization";
import { useInstitutionAndOutletsContext } from "@/components/providers/InstitutionsAndOutletsProvider";
import ProgressBar from "@/components/ui/progress-bar/ProgressBar";
import FilterTableCellPopOver from "@/features/filter-table/FilterTableCellPopover";
import { FilterTableContent } from "@/features/filter-table/FilterTableContent";
import { FilterTableHeaders } from "@/features/filter-table/FilterTableHeaders";
import { FilterTableRoot } from "@/features/filter-table/FilterTableRoot";
import GlobalFilterInput from "@/features/filter-table/GlobalFilterInput";
import { PaginationBar } from "@/features/filter-table/PaginationBar";
import RefreshDataButton from "@/features/filter-table/RefreshDataButton";
import { TableColumnDef } from "@/features/filter-table/types";
import { ExpandedOutlet, OutletsApis } from "@/lib/hooks/outlets-queries";
import { BaseEducator } from "@/types/data/Educator";
import { BaseStudent } from "@/types/data/Student";
import { useMemo } from "react";
import CreateOutletsMultiStepFormDialog from "../add-outlets-multistep-form/CreateOutletsMultiStepFormDialog";

export default function OutletsTable() {
  const { currentInstitution, currentOutlets, status } =
    useInstitutionAndOutletsContext();

  /**
   * fetch expanded outlet data for table and transform query results
   */

  let {
    data: expandedOutlets,
    isPending: expandedOutletsIsPending,
    refetch,
  } = OutletsApis.useGetExpandedOutlets(currentOutlets, currentInstitution?.id);

  /**
   * column definitions
   */
  const columns = useMemo<TableColumnDef<ExpandedOutlet>[]>(
    () => [
      {
        accessorKey: "name",
        header: ({ table }) => <span>OUTLET</span>,
        filterFn: "equalsString", //note: normal non-fuzzy filter column - exact match required
      },
      {
        accessorFn: (row) => row.courses, //note: normal non-fuzzy filter column - case sensitive
        id: "COURSES",
        cell: ({ row, cell }) => {
          let items = (cell.getValue() as BaseStudent[]).map((student) => {
            return {
              ...student,
              url: `/courses/${student.id}`,
            };
          });
          return (
            <FilterTableCellPopOver
              title='COURSES'
              items={items}
              footerNav={{ title: "Manage", url: "/courses" }}
            />
          );
        },
        header: ({ table }) => {
          return <span>COURSES</span>;
        },
        filterFn: "includesString", //note: normal non-fuzzy filter column - case insensitive
      },
      {
        accessorFn: (row) => row.students, //note: normal non-fuzzy filter column - case sensitive
        id: "STUDENTS",
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
        header: ({ table }) => {
          return <span>STUDENTS</span>;
        },
        filterFn: "includesString", //note: normal non-fuzzy filter column - case insensitive
      },
      {
        accessorFn: (row) => row.educators, //note: normal non-fuzzy filter column - case sensitive
        id: "EDUCATORS",
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
      {
        accessorFn: (row) => row.description, //note: normal non-fuzzy filter column - case sensitive
        id: "DESCRIPTION",
        header: () => <span>DESCRIPTION</span>,
        filterFn: "includesString", //note: normal non-fuzzy filter column - case insensitive
      },
    ],
    [],
  );

  if (status === "error") {
    throw new Error("Failed to fetch outlet or institution");
  }

  return (
    <div className='p-4'>
      <FilterTableRoot
        data={expandedOutlets}
        columns={columns}
        refreshData={refetch}
      >
        <div className='flex justify-between bg-white p-4 rounded-xl'>
          <GlobalFilterInput />
          <PaginationBar />
          <Authorization allowedRoles={["institution-admin"]} hideContent>
            <CreateOutletsMultiStepFormDialog />
          </Authorization>
          <RefreshDataButton />
        </div>
        <div className='w-full my-4 rounded-xl bg-white p-4'>
          <FilterTableHeaders />
          {expandedOutletsIsPending ? <ProgressBar /> : <FilterTableContent />}
        </div>
      </FilterTableRoot>
    </div>
  );
}
