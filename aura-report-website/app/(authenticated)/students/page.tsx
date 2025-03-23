"use client";
import { useInstitutionAndOutletsContext } from "@/components/providers/InstitutionsAndOutletsProvider";
import StudentsFilterTable from "@/features/students-dashboard/student-filter-table/StudentsFilterTable";
import { StudentsApis } from "@/lib/hooks/students-queries";

export default function StudentsPage() {
  const { currentInstitution, currentOutlet } =
    useInstitutionAndOutletsContext();
  const {
    error,
    data: students = [],
    refetch,
  } = StudentsApis.useGetAllStudentsFromOutlet(
    currentInstitution?.id,
    currentOutlet?.id,
  );

  if (error) {
    return (
      <div className='flex items-center justify-center w-full h-full'>
        Failed to fetch data, make a report to email@gmail.com with error code
      </div>
    );
  }

  return (
    <div>
      <StudentsFilterTable students={students} refetch={refetch} />
    </div>
  );
}
