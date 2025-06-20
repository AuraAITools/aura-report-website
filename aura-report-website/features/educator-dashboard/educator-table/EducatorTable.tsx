import { useInstitutionAndOutletsContext } from "@/components/providers/InstitutionsAndOutletsProvider";
import DialogButton from "@/components/ui/buttons/dialogButton/DialogButton";
import { ConcatenatedLinksList } from "@/components/ui/ConcatenatedLinksListProps";
import { FilterTableContentContainer } from "@/features/filter-table/FilterTableContainer";
import { FilterTableContent } from "@/features/filter-table/FilterTableContent";
import { FilterTableHeaders } from "@/features/filter-table/FilterTableHeaders";
import { FilterTableRoot } from "@/features/filter-table/FilterTableRoot";
import GlobalFilterInput from "@/features/filter-table/GlobalFilterInput";
import { PaginationBar } from "@/features/filter-table/PaginationBar";
import RefreshDataButton from "@/features/filter-table/RefreshDataButton";
import { TableColumnDef } from "@/features/filter-table/types";
import { EducatorsApis } from "@/lib/hooks/educators-queries";
import { ExpandedEducator } from "@/types/data/Educator";
import { useMemo } from "react";
import CreateEducatorForm from "../create-educator-form/CreateEducatorForm";

export default function EducatorTable() {
  const { currentInstitution, currentOutlet } =
    useInstitutionAndOutletsContext();
  const { data: educators = [], refetch } =
    EducatorsApis.useGetAllExpandedEducatorsFromOutlet(
      currentInstitution?.id,
      currentOutlet?.id,
    );

  // TODO: add columns for courses taught and total students under educator
  const columns = useMemo<TableColumnDef<ExpandedEducator>[]>(
    () => [
      {
        accessorKey: "name",
        header: ({ table }) => <span>NAME</span>,
        filterFn: "equalsString", //note: normal non-fuzzy filter column - exact match required
      },
      {
        accessorFn: (row) => row.employment_type.split("_").join(" "),
        id: "employment_type",
        header: ({ table }) => <span>EMPLOYMENT TYPE</span>,
        filterFn: "equalsString", //note: normal non-fuzzy filter column - exact match required
      },
      {
        accessorFn: (row) => {
          return row.levels ? (
            <ConcatenatedLinksList links={row.levels.map((lvl) => lvl.name)} />
          ) : (
            <div>None</div>
          );
        },
        id: "level",
        header: ({ table }) => <span>LEVEL(S)</span>,
        cell: ({ row, getValue }) => <div>{getValue<boolean>()}</div>,
        filterFn: "includesStringSensitive", //note: normal non-fuzzy filter column
      },
      {
        accessorFn: (row) => {
          return row.outlets ? (
            <ConcatenatedLinksList
              links={row.outlets.map((outlet) => outlet.name)}
            />
          ) : (
            <div>no outlets found</div>
          );
        },

        id: "outlet",
        header: ({ table }) => <span>OUTLET(S)</span>,
        cell: ({ row, getValue }) => <div>{getValue<boolean>()}</div>,
        filterFn: "includesStringSensitive", //note: normal non-fuzzy filter column
      },
      {
        accessorFn: (row) => (
          <div>
            {row.accounts.length > 0 ? row.accounts.at(0)?.contact : "N/A"}
          </div>
        ),
        id: "contact",
        header: ({ table }) => <span>CONTACT</span>,
        cell: (cell) => <div>{cell.getValue()}</div>,
        filterFn: "equalsString", //note: normal non-fuzzy filter column - exact match required
      },
    ],
    [],
  );
  return (
    <div className='p-4'>
      <FilterTableRoot data={educators} columns={columns} refreshData={refetch}>
        <div className='flex justify-between items-center p-4 rounded-xl bg-white'>
          <GlobalFilterInput />
          <PaginationBar />
          <div className='flex justify-center items-center p-2 gap-2'>
            <DialogButton
              // TODO: create educator form
              dialogFn={(onSuccess) => (
                <CreateEducatorForm onSuccess={onSuccess} />
              )}
              dialogTitle={"Create Educator"}
              buttonTitle={"Create Educator"}
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
