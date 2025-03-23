"use client";
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
import { CreateSubjectForm } from "@/features/subjects-dashboard/create-subject-form/CreateSubjectForm";
import { SubjectsApis } from "@/lib/hooks/subject-queries";
import { BaseSubject } from "@/types/data/Subject";
import { Row } from "@tanstack/react-table";
import { ReactNode, useMemo } from "react";

export default function SubjectsPage() {
  const { currentInstitution, currentOutlet } =
    useInstitutionAndOutletsContext();

  const {
    data: subjects,
    refetch,
    isPending,
  } = SubjectsApis.useGetAllSubjectsOfInstitution(currentInstitution?.id);

  const columns = useMemo<TableColumnDef<BaseSubject>[]>(
    () => [
      {
        accessorKey: "name",
        header: ({ table }) => <span>SUBJECTS</span>,
        filterFn: "equalsString", //note: normal non-fuzzy filter column - exact match required
      },
      //   {
      //     accessorFn: (row) => (
      //       <ConcatenatedLinksList
      //         links={row.subjects.map((sub) => {
      //           console.log(JSON.stringify(sub));
      //           return sub.name;
      //         })}
      //       />
      //     ),
      //     id: "subjects",
      //     header: ({ table }) => <span>SUBJECTS</span>,
      //     cell: ({ row, getValue }) => <div>{getValue<boolean>()}</div>,
      //     filterFn: "includesStringSensitive", //note: normal non-fuzzy filter column
      //   },
      //   {
      //     accessorFn: (row) => row.courses, //note: normal non-fuzzy filter column - case sensitive
      //     id: "courses",
      //     cell: ({ row, cell }) => {
      //       let items = (cell.getValue() as BaseCourse[]).map((course) => {
      //         return {
      //           ...course,
      //           url: `/courses/${course.id}`,
      //         };
      //       });
      //       return (
      //         <FilterTableCellPopOver
      //           title='CLASSES'
      //           items={items}
      //           footerNav={{ title: "Manage", url: "/courses" }}
      //         />
      //       );
      //     },
      //     header: ({ table }) => {
      //       return <span>CLASSES</span>;
      //     },
      //     filterFn: "includesString", //note: normal non-fuzzy filter column - case insensitive
      //   },
      //   {
      //     accessorFn: (row) => row.students, //note: normal non-fuzzy filter column - case sensitive
      //     id: "students",
      //     cell: ({ row, cell }) => {
      //       let items = (cell.getValue() as BaseStudent[]).map((student) => {
      //         return {
      //           ...student,
      //           url: `/students/${student.id}`,
      //         };
      //       });
      //       return (
      //         <FilterTableCellPopOver
      //           title='STUDENTS'
      //           items={items}
      //           footerNav={{ title: "Manage", url: "/students" }}
      //         />
      //       );
      //     },
      //     header: () => <span>STUDENTS</span>,
      //     filterFn: "includesString", //note: normal non-fuzzy filter column - case insensitive
      //   },
      //   {
      //     accessorFn: (row) => row.educators, //note: normal non-fuzzy filter column - case sensitive
      //     id: "educators",
      //     cell: ({ row, cell }) => {
      //       let items = (cell.getValue() as BaseEducator[]).map((educator) => {
      //         return {
      //           ...educator,
      //           url: `/educators/${educator.id}`,
      //         };
      //       });
      //       return (
      //         <FilterTableCellPopOver
      //           title='EDUCATORS'
      //           items={items}
      //           footerNav={{ title: "Manage", url: "/educators" }}
      //         />
      //       );
      //     },
      //     header: () => <span>EDUCATORS</span>,
      //     filterFn: "includesString", //note: normal non-fuzzy filter column - case insensitive
      //   },
    ],
    [],
  );

  return (
    <div className='p-4'>
      <FilterTableRoot
        data={subjects ?? []}
        columns={columns}
        refreshData={refetch}
      >
        <div className='flex justify-between items-center p-4 rounded-xl bg-white'>
          <GlobalFilterInput />
          <PaginationBar />
          <div className='flex justify-center items-center p-2 gap-2'>
            <DialogButton
              dialogFn={(onSuccess) => (
                <CreateSubjectForm onSuccess={onSuccess} />
              )}
              buttonTitle='Create Subject'
            />
            <RefreshDataButton />
          </div>
        </div>
        <FilterTableContentContainer>
          <FilterTableHeaders />
          {/* TODO: implement edit form*/}
          <FilterTableContent />
        </FilterTableContentContainer>
      </FilterTableRoot>
    </div>
  );
}
