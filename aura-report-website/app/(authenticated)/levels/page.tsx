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
import { ExpandedLevel, LevelsApis } from "@/lib/hooks/levels-queries";
import { BaseEducator } from "@/types/data/Educator";
import { Row } from "@tanstack/react-table";
import { useMemo } from "react";

export default function LevelsPage() {
  const { currentInstitution, currentOutlet } =
    useInstitutionAndOutletsContext();

  const { data: expandedLevels = [], refetch } =
    LevelsApis.useGetAllExpandedLevelsOfInstitution(currentInstitution?.id);

  const columns = useMemo<TableColumnDef<ExpandedLevel>[]>(
    () => [
      {
        accessorKey: "name",
        header: ({ table }) => <span>LEVELS</span>,
        filterFn: "equalsString", //note: normal non-fuzzy filter column - exact match required
      },
      {
        accessorFn: (row) => (
          <>
            {row.subjects ? (
              <ConcatenatedLinksList
                links={row.subjects.map((sub) => sub.name)}
              />
            ) : (
              <div>None</div>
            )}
          </>
        ),
        id: "subjects",
        header: ({ table }) => <span>SUBJECTS</span>,
        cell: ({ row, getValue }) => <div>{getValue<boolean>()}</div>,
        filterFn: "includesStringSensitive", //note: normal non-fuzzy filter column
      },
      {
        accessorFn: (row) => {
          if (!row.courses) {
            return <div>no courses</div>;
          }
          let items = row.courses.map((course) => {
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
        }, //note: normal non-fuzzy filter column - case sensitive
        id: "courses",
        cell: ({ row, getValue }) => <div>{getValue<boolean>()}</div>,
        header: ({ table }) => {
          return <span>CLASSES</span>;
        },
        filterFn: "includesString", //note: normal non-fuzzy filter column - case insensitive
      },
      {
        accessorFn: (row) => {
          if (!row.students) {
            return <div>"no students"</div>;
          }
          const items = row.students.map((student) => ({
            ...student,
            url: `/students/${student.id}`,
          }));
          return (
            <FilterTableCellPopOver
              title='STUDENTS'
              items={items}
              footerNav={{ title: "Manage", url: "/students" }}
            />
          );
        }, //note: normal non-fuzzy filter column - case sensitive
        id: "students",
        cell: ({ row, cell }) => cell.getValue(),
        header: () => <span>STUDENTS</span>,
        filterFn: "includesString", //note: normal non-fuzzy filter column - case insensitive
      },
      {
        accessorFn: (row) => row.educators ?? "no educators", //note: normal non-fuzzy filter column - case sensitive
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
    ],
    [],
  );

  return (
    <div className='p-4'>
      <FilterTableRoot
        data={expandedLevels}
        columns={columns}
        refreshData={refetch}
      >
        <div className='flex justify-between items-center p-4 rounded-xl bg-white'>
          <GlobalFilterInput />
          <PaginationBar />
          <div className='flex justify-center items-center p-2 gap-2'>
            <DialogButton
              dialogFn={(onSuccess) => (
                <CreateLevelsForm onSuccess={onSuccess} />
              )}
              buttonTitle='Create Level'
            />
            <RefreshDataButton />
          </div>
        </div>
        <FilterTableContentContainer>
          <FilterTableHeaders />
          <FilterTableContent
            editRowContent={(row: Row<ExpandedLevel>) => (
              <EditLevelForm level={row.original} />
            )}
          />
        </FilterTableContentContainer>
      </FilterTableRoot>
    </div>
  );
}
