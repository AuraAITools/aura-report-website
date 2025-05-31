import Authorization from "@/components/providers/Authorization";
import { useInstitutionAndOutletsContext } from "@/components/providers/InstitutionsAndOutletsProvider";
import DialogButton from "@/components/ui/buttons/dialogButton/DialogButton";
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
import CreateOutletForm from "../add-outlets-multistep-form/CreateOutletForm";
import { Row } from "@tanstack/react-table";
import EditOutletForm from "../edit-outlets-form/EditOutletForm";
import { FilterTableContentContainer } from "@/features/filter-table/FilterTableContainer";

export default function OutletsTable() {
  const { currentInstitution } = useInstitutionAndOutletsContext();

  /**
   * fetch expanded outlet data for table and transform query results
   */

  let { data: expandedOutlets = [], refetch } =
    OutletsApis.useGetExpandedOutlets(currentInstitution?.id);

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
          return <span>CLASSES</span>;
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

  return (
    <div className='p-4'>
      <FilterTableRoot
        data={expandedOutlets}
        columns={columns}
        refreshData={refetch}
      >
        <div className='flex justify-between items-center p-4 rounded-xl bg-white'>
          <GlobalFilterInput />
          <PaginationBar />
          <div className='flex justify-center items-center p-2 gap-2'>
            <Authorization allowedRoles={["institution-admin"]} hideContent>
              <DialogButton
                dialogFn={(onSuccess) => (
                  <CreateOutletForm onSuccess={onSuccess} />
                )}
                dialogTitle={"Create Outlet"}
                buttonTitle={"Create Outlet"}
              />
            </Authorization>
            <RefreshDataButton />
          </div>
        </div>
        <FilterTableContentContainer>
          <FilterTableHeaders />
          <FilterTableContent
            editRowContent={(row: Row<ExpandedOutlet>) => (
              <EditOutletForm outlet={row.original} />
            )}
          />
        </FilterTableContentContainer>
      </FilterTableRoot>
    </div>
  );
}
