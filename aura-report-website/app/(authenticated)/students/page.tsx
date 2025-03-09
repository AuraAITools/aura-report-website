"use client";
import { useInstitutionAndOutletsContext } from "@/components/providers/InstitutionsAndOutletsProvider";
import LoadingComponent from "@/components/ui/loading/LoadingComponent";
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

  if (fetchingStudents == "pending") {
    return (
      <LoadingComponent
        image={{
          src: "/Logo.png",
          alt: "Aura logo",
          className: "animate-spin-slow",
          width: 40,
          height: 40,
        }}
        loadingMessage={"Fetching Students"}
      />
    );
  }

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
