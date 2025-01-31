"use client";
import { useInstitutionAndOutletsContext } from "@/components/providers/InstitutionsAndOutletsProvider";
import LoadingComponent from "@/components/ui/loading/LoadingComponent";
import StudentsFilterTable from "@/features/students-dashboard/student-filter-table/StudentsFilterTable";
import { useGetAllStudents } from "@/lib/hooks/useStudents";

export default function StudentsPage() {
  const {
    status: fetchingStudents,
    error,
    data: students,
    refetch,
  } = useGetAllStudents();
  const { currentInstitution, status: fetchingInstitution } =
    useInstitutionAndOutletsContext();

  if (fetchingStudents == "pending" || fetchingInstitution == "pending") {
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

  // return (
  //   <div className='flex flex-col'>
  //     <MultiStepFormDialog />
  //     {students.map((student) => (
  //       <StudentListItem
  //         key={`student_li_${student.id}`}
  //         image={
  //           "https://images.unsplash.com/photo-1492633423870-43d1cd2775eb?&w=128&h=128&dpr=2&q=80"
  //         }
  //         {...student}
  //       />
  //     ))}
  //   </div>
  // );
  return <StudentsFilterTable students={students} refetch={refetch} />;
}

function EmptyListDisplay() {
  return (
    <div className='flex flex-1 w-full h-full bg-white items-center justify-center'>
      No students found
    </div>
  );
}

// type StudentListItemProp = {
//   image: string;
// } & Student;

// function StudentListItem(props: StudentListItemProp) {
//   const [show, setShown] = useState<boolean>(false);

//   let initials = props.name
//     .split(" ")
//     .map((word) => word[0])
//     .join("");
//   return (
//     <>
//       <div className='flex gap-4 bg-white items-center justify-center border-gray-300 border-[1px] py-2 px-4 max-h-12 overflow-hidden'>
//         <CheckBox checked={false} />
//         <AvatarProfile src={props.image} alt={props.name} fallback={initials} />
//         <p className='w-32'>{props.name}</p>
//         <p className='w-8'>{props.currentLevel}</p>
//         <p className='w-64'>{props.currentSchool}</p>
//         <div className='ml-auto' />
//         <button>
//           <DotsVerticalIcon
//             onClick={() => setShown(true)}
//             className=' hover:text-orange-300'
//           />
//         </button>
//         <button>
//           <Cross1Icon className='text-red-400 size-4' />
//         </button>
//       </div>
//       <SideModal onClick={() => setShown(false)} show={show} {...props} />
//     </>
//   );
// }
