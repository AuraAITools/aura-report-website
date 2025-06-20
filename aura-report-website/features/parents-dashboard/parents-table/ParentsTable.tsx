import { useInstitutionAndOutletsContext } from "@/components/providers/InstitutionsAndOutletsProvider";
import FilterTableCellPopOver from "@/features/filter-table/FilterTableCellPopover";
import { FilterTableContentContainer } from "@/features/filter-table/FilterTableContainer";
import { FilterTableContent } from "@/features/filter-table/FilterTableContent";
import { FilterTableHeaders } from "@/features/filter-table/FilterTableHeaders";
import { FilterTableRoot } from "@/features/filter-table/FilterTableRoot";
import GlobalFilterInput from "@/features/filter-table/GlobalFilterInput";
import { PaginationBar } from "@/features/filter-table/PaginationBar";
import RefreshDataButton from "@/features/filter-table/RefreshDataButton";
import { TableColumnDef } from "@/features/filter-table/types";
import { AccountsApis } from "@/lib/hooks/accounts-queries";
import { ExpandedAccount } from "@/types/data/Account";
import { BaseStudent } from "@/types/data/Student";
import { useMemo } from "react";

export default function ParentsTable() {
  const { currentInstitution } = useInstitutionAndOutletsContext();

  const { data: expandedAccounts = [], refetch } =
    AccountsApis.useGetAllExpandedAccountsInInstitution(currentInstitution?.id);

  const parents = expandedAccounts.filter(
    (acc) => !!acc.student_client_subaccount,
  );

  /**
   * column definitions
   */
  const columns = useMemo<TableColumnDef<ExpandedAccount>[]>(
    () => [
      {
        accessorKey: "first_name",
        id: "NAME",
        header: ({ table }) => <span>NAME</span>,
        filterFn: "equalsString", //note: normal non-fuzzy filter column - exact match required
      },
      {
        accessorFn: (row) =>
          row.student_client_subaccount?.students ?? "no student subaccount", //note: normal non-fuzzy filter column - case sensitive
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
  return (
    <div className='p-4'>
      <FilterTableRoot data={parents} columns={columns} refreshData={refetch}>
        <div className='flex justify-between bg-white p-4 rounded-xl'>
          <GlobalFilterInput />
          <PaginationBar />
          {/* TODO: create button to create student clietn account + add student */}
          <RefreshDataButton />
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
