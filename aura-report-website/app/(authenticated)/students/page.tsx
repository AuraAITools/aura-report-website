"use client";
import { useInstitutionAndOutletsContext } from "@/components/providers/InstitutionsAndOutletsProvider";
import StudentsFilterTable from "@/features/students-dashboard/student-filter-table/StudentsFilterTable";
import { StudentsApis } from "@/lib/hooks/students-queries";

export default function StudentsPage() {
  const { currentInstitution } = useInstitutionAndOutletsContext();
  const {
    status: fetchingStudents,
    error,
    data: students,
    refetch,
  } = StudentsApis.useGetAllStudentsFromInstitution(currentInstitution?.id);

  if (error) {
    return (
      <div className='flex items-center justify-center w-full h-full'>
        Failed to fetch data, make a report to email@gmail.com with error code
      </div>
    );
  }

  return (
    <div>
      <StudentsFilterTable students={students ?? []} refetch={refetch} />
    </div>
  );
}
