import { useInstitutionAndOutletsContext } from "@/components/providers/InstitutionsAndOutletsProvider";
import FilterTableCellPopOver from "@/features/filter-table/FilterTableCellPopover";
import { FilterTableContent } from "@/features/filter-table/FilterTableContent";
import { FilterTableHeaders } from "@/features/filter-table/FilterTableHeaders";
import { FilterTableRoot } from "@/features/filter-table/FilterTableRoot";
import GlobalFilterInput from "@/features/filter-table/GlobalFilterInput";
import { PaginationBar } from "@/features/filter-table/PaginationBar";
import RefreshDataButton from "@/features/filter-table/RefreshDataButton";
import { TableColumnDef } from "@/features/filter-table/types";
import { useGetAllParents } from "@/lib/hooks/parents-queries";
import { BaseParentClientAccount } from "@/types/data/Parents";
import { BaseStudent } from "@/types/data/Student";
import { Row } from "@tanstack/react-table";
import { ReactNode, useMemo } from "react";

export default function ParentsTable() {
  const { currentInstitution, status } = useInstitutionAndOutletsContext();

  const {
    data: parents = [],
    isPending,
    refetch,
  } = useGetAllParents(currentInstitution?.id);

  /**
   * column definitions
   */
  const columns = useMemo<TableColumnDef<BaseParentClientAccount>[]>(
    () => [
      {
        accessorKey: "first_name",
        header: ({ table }) => <span>NAME</span>,
        filterFn: "equalsString", //note: normal non-fuzzy filter column - exact match required
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
        accessorFn: (row) => row.email, //note: normal non-fuzzy filter column - case sensitive
        id: "EMAIL",
        header: () => <span>EMAIL</span>,
        filterFn: "includesString", //note: normal non-fuzzy filter column - case insensitive
      },
      {
        accessorFn: (row) => row.contact, //note: normal non-fuzzy filter column - case sensitive
        id: "CONTACT",
        header: () => <span>CONTACT</span>,
        filterFn: "includesString", //note: normal non-fuzzy filter column - case insensitive
      },
    ],
    [],
  );

  if (status === "error") {
    throw new Error("cannot load outlets");
  }

  return (
    <div className='p-4'>
      <FilterTableRoot data={parents} columns={columns} refreshData={refetch}>
        <div className='flex justify-between bg-white p-4 rounded-xl'>
          <GlobalFilterInput />
          <PaginationBar />
          {/* TODO: create button to create student clietn account + add student */}
          <RefreshDataButton />
        </div>
        <div className='w-full my-4 rounded-xl bg-white p-4'>
          <FilterTableHeaders />
          {/* TODO: implement */}

          <FilterTableContent
            editRowContent={function (row: Row<any>): ReactNode {
              throw new Error("Function not implemented.");
            }}
          />
        </div>
      </FilterTableRoot>
    </div>
  );
}
