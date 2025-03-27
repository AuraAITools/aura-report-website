import { FormField } from "@/components/forms/FormField";
import SelectFormField from "@/components/forms/SelectFormField";
import SelectMultipleFormField from "@/components/forms/SelectMultipleFormField";
import SubmitButton from "@/components/forms/SubmitButton";
import { useInstitutionAndOutletsContext } from "@/components/providers/InstitutionsAndOutletsProvider";
import { CoursesApis } from "@/lib/hooks/courses-queries";
import { EducatorsApis } from "@/lib/hooks/educators-queries";
import { LessonsApis } from "@/lib/hooks/lessons-queries";
import { StudentsApis } from "@/lib/hooks/students-queries";
import {
  CreateLessonParams,
  CreateLessonParamsSchema,
} from "@/lib/requests/lesson";
import { LESSON_STATUS } from "@/types/data/Lesson";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
type CreateLessonFormProps = {
  onSuccess: () => void;
};
export default function CreateLessonForm(props: CreateLessonFormProps) {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<CreateLessonParams>({
    resolver: zodResolver(CreateLessonParamsSchema),
  });
  const { currentInstitution, currentOutlet } =
    useInstitutionAndOutletsContext();
  // get all educators
  const { data: educators = [] } =
    EducatorsApis.useGetAllEducatorsFromInstitution(
      currentInstitution?.id,
      currentOutlet?.id,
    );
  // get all students
  const { data: students = [] } = StudentsApis.useGetAllStudentsFromInstitution(
    currentInstitution?.id,
  );
  const { mutate: createLesson } = LessonsApis.useCreateLessonInOutlet();
  const { data: courses = [] } = CoursesApis.useGetAllCoursesFromOutlet(
    currentInstitution?.id,
    currentOutlet?.id,
  );
  const onSubmit: SubmitHandler<CreateLessonParams> = (params) => {
    console.log(JSON.stringify(params));
    createLesson(params, { onSuccess: props.onSuccess });
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
        errorMessage={errors.institution_id?.message}
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
        errorMessage={errors.outlet_id?.message}
      />
      {/* Course ids */}
      <SelectFormField
        {...register("course_id")}
        labelText={"Course"}
        options={courses.map((course) => ({
          value: course.id,
          display: course.name,
        }))}
        type='text'
        errorMessage={errors.course_id?.message}
      />
      {/* educator */}
      <SelectMultipleFormField
        {...register("educator_ids")}
        labelText={"Educator(s)"}
        options={educators.map((edu) => ({
          value: edu.id,
          display: edu.name,
        }))}
        formFieldName={""}
        errorMessage={errors.educator_ids?.message}
      />
      <FormField
        {...register("name")}
        labelText='Lesson Name (Optional)'
        placeholder={"i.e. lesson name"}
        type='text'
        errorMessage={errors.name?.message}
      />
      <SelectMultipleFormField
        {...register("student_ids")}
        labelText={"Student(s)"}
        options={students.map((student) => ({
          value: student.id,
          display: student.name,
        }))}
        formFieldName={""}
        errorMessage={errors.student_ids?.message}
      />
      <FormField
        {...register("description")}
        labelText='description'
        placeholder={"i.e. description"}
        type='text'
        errorMessage={errors.description?.message}
      />
      <FormField
        {...register("date")}
        labelText='lesson date'
        type='date'
        errorMessage={errors.date?.message}
      />
      <FormField
        {...register("start_time")}
        labelText='lesson start time'
        type='time'
        errorMessage={errors.start_time?.message}
      />
      <FormField
        {...register("end_time")}
        labelText='lesson end time'
        type='time'
        errorMessage={errors.end_time?.message}
      />
      <SelectFormField
        {...register("status")}
        options={LESSON_STATUS.map((status) => ({
          value: status,
          display: status,
        }))}
        defaultValue={LESSON_STATUS[4]}
        labelText='Lesson Status'
        type='text'
        errorMessage={errors.status?.message}
      />
      <SubmitButton
        className='mt-2 w-full'
        disabled={isSubmitting}
        buttonTitle={"Create Lesson"}
        isSubmitting={isSubmitting}
      />
    </form>
  );
}
