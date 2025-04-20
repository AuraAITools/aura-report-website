"use client";

import { useInstitutionAndOutletsContext } from "@/components/providers/InstitutionsAndOutletsProvider";
import DialogButton from "@/components/ui/buttons/dialogButton/DialogButton";
import { ConcatenatedLinksList } from "@/components/ui/ConcatenatedLinksListProps";
import FilterTableCellPopOver from "@/features/filter-table/FilterTableCellPopover";
import { FilterTableContentContainer } from "@/features/filter-table/FilterTableContainer";
import { FilterTableContent } from "@/features/filter-table/FilterTableContent";
import { FilterTableHeaders } from "@/features/filter-table/FilterTableHeaders";
import { FilterTableRoot } from "@/features/filter-table/FilterTableRoot";
import GlobalFilterInput from "@/features/filter-table/GlobalFilterInput";
import { PaginationBar } from "@/features/filter-table/PaginationBar";
import RefreshDataButton from "@/features/filter-table/RefreshDataButton";
import { TableColumnDef } from "@/features/filter-table/types";
import CreateLevelsForm from "@/features/levels-dashboard/create-levels-form/CreateLevelsForm";
import EditLevelForm from "@/features/levels-dashboard/edit-level-form/EditLevelForm";
import { LevelsApis } from "@/lib/hooks/levels-queries";
import { OutletRoomsApis } from "@/lib/hooks/outlet-rooms-queries";
import { ExpandedLevel } from "@/lib/requests/levels";
import { BaseCourse } from "@/types/data/Course";
import { BaseEducator } from "@/types/data/Educator";
import { BaseStudent } from "@/types/data/Student";
import { Row } from "@tanstack/react-table";
import { useMemo } from "react";

export default function RoomsPage() {
  const { currentInstitution, currentOutlet } =
    useInstitutionAndOutletsContext();

  const { data: outletRooms = [], refetch } =
    OutletRoomsApis.useGetAllOutletsRoomsOfOutlet(
      currentInstitution?.id,
      currentOutlet?.id,
    );

  const columns = useMemo<TableColumnDef<ExpandedLevel>[]>(
    () => [
      {
        accessorKey: "name",
        header: ({ table }) => <span>Rooms</span>,
        filterFn: "equalsString", //note: normal non-fuzzy filter column - exact match required
      },
      {
        accessorKey: "size",
        header: ({ table }) => <span>max size</span>,
        filterFn: "equalsString", //note: normal non-fuzzy filter column - exact match required
      },
      {
        accessorKey: "details",
        header: ({ table }) => <span>details</span>,
        filterFn: "equalsString", //note: normal non-fuzzy filter column - exact match required
      },
    ],
    [],
  );

  return (
    <div className='p-4'>
      <FilterTableRoot
        data={outletRooms}
        columns={columns}
        refreshData={refetch}
      >
        <div className='flex justify-between items-center p-4 rounded-xl bg-white'>
          <GlobalFilterInput />
          <PaginationBar />
          <div className='flex justify-center items-center p-2 gap-2'>
            <DialogButton
              dialogFn={(onSuccess) => (
                <CreateLevelsForm onSuccess={onSuccess} /> // TODO: create rooms form
              )}
              buttonTitle='Create Rooms'
            />
            <RefreshDataButton />
          </div>
        </div>
        <FilterTableContentContainer>
          <FilterTableHeaders />
          <FilterTableContent
            editRowContent={(row: Row<ExpandedLevel>) => (
              <EditLevelForm level={row.original} /> // TODO: edit rooms form
            )}
          />
        </FilterTableContentContainer>
      </FilterTableRoot>
    </div>
  );
}
