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
import { StudentApis } from "@/lib/hooks/student-queries";
import { getAllCoursesFromOutlet } from "@/lib/requests/courses";
import { getAllEducatorsFromOutlet } from "@/lib/requests/educator";
import { getAllStudentsFromOutlet } from "@/lib/requests/students";
import { BaseCourse } from "@/types/data/Course";
import { BaseEducator } from "@/types/data/Educator";
import { BaseOutlet } from "@/types/data/Outlet";
import { BaseStudent } from "@/types/data/Student";
import { useMemo } from "react";
import CreateOutletsMultiStepFormDialog from "../add-outlets-multistep-form/CreateOutletsMultiStepFormDialog";

type ExpandedOutlet = {
  courses: BaseCourse[];
  educators: BaseEducator[];
  students: BaseStudent[];
} & BaseOutlet;

export default function OutletsTable() {
  const { currentInstitution, currentOutlets, status } =
    useInstitutionAndOutletsContext();

  if (status === "pending") {
    return <ProgressBar />;
  }
  /**
   * fetch expanded outlet data for table and transform query results
   */

  // TODO: move this query logic to get student, course and educator from an institution x outlet to a student-queries.ts file etc...
  // let {
  //   data: expandedOutlets,
  //   isPending,
  //   refetch,
  // } = useQueries({
  //   queries: currentOutlets.map((co) => ({
  //     queryKey: [outletKeys.all, co.id, "courses"],
  //     queryFn: () => fetchExpandedOutlets(currentInstitution?.id!, co), // this id will definitely not be falsy due to the enabled check
  //     enabled:
  //       !!currentOutlets && !!currentInstitution && currentOutlets.length > 0,
  //   })),
  //   combine: (results) => {
  //     return {
  //       data: results.map((res) => res.data),
  //       isPending: results.some((res) => res.isPending),
  //       refetch: () => {
  //         results.forEach((query) => query.refetch());
  //       },
  //     };
  //   },
  // });

  const {
    data: students,
    isPending,
    refetch,
  } = StudentApis.getAllStudentOfOutlets(
    currentInstitution!.id,
    currentOutlets.map((co) => co.id),
  );

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
          {isPending ? <ProgressBar /> : <FilterTableContent />}
        </div>
      </FilterTableRoot>
    </div>
  );
}

/**
 * function that asynchronously fetches associations (courses, educators, students) for an outlet and transforms the results
 * @param institutionId
 * @param outlet
 * @returns
 */
async function fetchExpandedOutlets(
  institutionId: string,
  outlet: BaseOutlet,
): Promise<ExpandedOutlet> {
  let [courses, educators, students] = await Promise.all([
    getAllCoursesFromOutlet(institutionId, outlet.id),
    getAllEducatorsFromOutlet(institutionId, outlet.id),
    getAllStudentsFromOutlet(institutionId, outlet.id),
  ]);

  return {
    ...outlet,
    courses,
    educators,
    students,
  };
}
