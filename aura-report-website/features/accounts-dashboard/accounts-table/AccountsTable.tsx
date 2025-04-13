import { useInstitutionAndOutletsContext } from "@/components/providers/InstitutionsAndOutletsProvider";
import DialogButton from "@/components/ui/buttons/dialogButton/DialogButton";
import { FilterTableContentContainer } from "@/features/filter-table/FilterTableContainer";
import { FilterTableContent } from "@/features/filter-table/FilterTableContent";
import { FilterTableHeaders } from "@/features/filter-table/FilterTableHeaders";
import { FilterTableRoot } from "@/features/filter-table/FilterTableRoot";
import GlobalFilterInput from "@/features/filter-table/GlobalFilterInput";
import { PaginationBar } from "@/features/filter-table/PaginationBar";
import RefreshDataButton from "@/features/filter-table/RefreshDataButton";
import { TableColumnDef } from "@/features/filter-table/types";
import CreateLessonForm from "@/features/lessons-dashboard/create-lesson-form/CreateLessonForm";
import EditLessonDetailsForm from "@/features/lessons-dashboard/edit-lesson-form/EditLessonDetailsForm";
import { AccountsApis } from "@/lib/hooks/accounts-queries";
import { BaseAccount } from "@/types/data/Account";
import { ExpandedLesson } from "@/types/data/Lesson";
import { generateKey } from "@/utils/id";
import { Row } from "@tanstack/react-table";
import React, { useMemo } from "react";

export default function AccountsTable() {
  const { currentInstitution } = useInstitutionAndOutletsContext();
  const { data: expandedAccounts = [], refetch } =
    AccountsApis.useGetAllExpandedAccountsInInstitution(currentInstitution?.id);

  const columns = useMemo<TableColumnDef<BaseAccount>[]>(
    () => [
      {
        accessorFn: (row) => <div>{`${row.first_name} ${row.last_name}`}</div>,
        id: "name",
        cell: ({ row, getValue }) => <div>{getValue<boolean>()}</div>,
        header: ({ table }) => <span>ACCOUNT HOLDER</span>,
        filterFn: "equalsString", //note: normal non-fuzzy filter column - exact match required
      },
      {
        accessorKey: "email",
        header: ({ table }) => <span>EMAIL</span>,
        filterFn: "equalsString", //note: normal non-fuzzy filter column - exact match required
      },
      {
        accessorFn: (row) => (
          <TableTagItems
            items={row.personas.flatMap((persona) => persona.display_roles)}
            default='No Roles Added'
          />
        ),
        id: "roles",
        header: ({ table }) => <span>ROLES</span>,
        cell: ({ row, getValue }) => <div>{getValue<boolean>()}</div>,
        filterFn: "includesStringSensitive", //note: normal non-fuzzy filter column
      },
      {
        accessorFn: (row) => (
          <TableTagItems items={row.pending_account_actions} default={"None"} />
        ),
        id: "pending_account_tagItems",
        header: ({ table }) => <span>PENDING ACTIONS</span>,
        cell: ({ row, getValue }) => <div>{getValue<boolean>()}</div>,
        filterFn: "includesStringSensitive", //note: normal non-fuzzy filter column
      },
    ],
    [],
  );

  /**
   * TODO: implement Create Account form
   * @param row
   * @returns
   */
  const renderEditLessonForm = (row: Row<ExpandedLesson>) => {
    return <EditLessonDetailsForm lesson={row.original} />;
  };

  return (
    <div className='p-4'>
      <FilterTableRoot
        data={expandedAccounts}
        columns={columns}
        refreshData={refetch}
      >
        <div className='flex justify-between items-center p-4 rounded-xl bg-white'>
          <GlobalFilterInput />
          <PaginationBar />
          <div className='flex justify-center items-center p-2 gap-2'>
            <DialogButton
              dialogFn={(onSuccess) => (
                <CreateLessonForm onSuccess={onSuccess} />
              )}
              buttonTitle={"Create Account"}
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

export type TableTagItemsProps = {
  items: string[];
  default: string;
};
export function TableTagItems(props: TableTagItemsProps) {
  return (
    <ul className='flex gap-2'>
      {props.items.length > 0 ? (
        props.items.map((tagItem, idx) => (
          <span
            className='bg-red-300 rounded-md text-white p-2'
            key={generateKey("_table_tag_item", tagItem, idx.toString())}
          >
            {tagItem.split("_").join(" ").toLowerCase()}
          </span>
        ))
      ) : (
        <div>{props.default}</div>
      )}
    </ul>
  );
}
