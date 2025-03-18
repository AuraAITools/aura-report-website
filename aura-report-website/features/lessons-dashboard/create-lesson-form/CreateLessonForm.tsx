import { FormField } from "@/components/forms/FormField";
import SelectFormField from "@/components/forms/SelectFormField";
import SelectMultipleFormField from "@/components/forms/SelectMultipleFormField";
import SubmitButton from "@/components/forms/SubmitButton";
import { useInstitutionAndOutletsContext } from "@/components/providers/InstitutionsAndOutletsProvider";
import { CoursesApis } from "@/lib/hooks/courses-queries";
import { EducatorsApis } from "@/lib/hooks/educators-queries";
import { LessonsApis } from "@/lib/hooks/lessons-queries";
import { StudentsApis } from "@/lib/hooks/students-queries";
import { CreateLessonParams } from "@/lib/requests/lesson";
import { SubmitHandler, useForm } from "react-hook-form";

export default function CreateLessonForm() {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<CreateLessonParams>({});
  const { currentInstitution, currentOutlet } =
    useInstitutionAndOutletsContext();
  // get all educators
  const { data: educators } = EducatorsApis.useGetAllEducatorsFromInstitution(
    currentInstitution?.id,
    currentOutlet?.id,
  );
  // get all students
  const { data: students } = StudentsApis.useGetAllStudentsFromInstitution(
    currentInstitution?.id,
  );
  const { mutate } = LessonsApis.useCreateLessonInOutlet();
  const { data: courses } = CoursesApis.useGetAllCoursesFromOutlet(
    currentInstitution?.id,
    currentOutlet?.id,
  );
  const onSubmit: SubmitHandler<CreateLessonParams> = (params) => {
    console.log(JSON.stringify(params));
    mutate(params);
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <SelectFormField
        {...register("institution_id")}
        options={[
          {
            value: currentInstitution?.id ?? "loading",
            display: currentInstitution?.name ?? "loading",
          },
        ]}
        labelText='institution'
        disabled
        type='text'
        className='w-1/2'
      />
      <SelectFormField
        {...register("outlet_id")}
        options={[
          {
            value: currentOutlet?.id ?? "loading",
            display: currentOutlet?.name ?? "loading",
          },
        ]}
        labelText='outlets'
        disabled
        type='text'
        className='w-1/2'
      />
      {/* Course ids */}
      <SelectMultipleFormField
        {...register("course_id")}
        labelText={"Course"}
        options={
          courses?.map((course) => ({
            value: course.id,
            display: course.name,
          })) ?? []
        }
        formFieldName={""}
      />
      {/* educator */}
      <SelectMultipleFormField
        {...register("educator_ids")}
        labelText={"Educator(s)"}
        options={
          educators?.map((edu) => ({
            value: edu.id,
            display: edu.name,
          })) ?? []
        }
        formFieldName={""}
      />
      <FormField
        {...register("name")}
        labelText='Lesson Name (Optional)'
        placeholder={"i.e. lesson name"}
        type='text'
        className='w-1/2'
      />
      <SelectMultipleFormField
        {...register("student_ids")}
        labelText={"Student(s)"}
        options={
          students?.map((student) => ({
            value: student.id,
            display: student.name,
          })) ?? []
        }
        formFieldName={""}
      />
      <FormField
        {...register("description")}
        labelText='description'
        placeholder={"i.e. description"}
        type='text'
        className='w-1/2'
      />
      <FormField
        {...register("date")}
        labelText='lesson date'
        type='date'
        className='w-1/2'
      />
      <FormField
        {...register("start_time")}
        labelText='lesson start time'
        type='time'
        className='w-1/2'
      />
      <FormField
        {...register("end_time")}
        labelText='lesson end time'
        type='time'
        className='w-1/2'
      />
      <SubmitButton
        disabled={isSubmitting}
        buttonTitle={"Add Lesson"}
        isSubmitting={isSubmitting}
      />
    </form>
  );
}
