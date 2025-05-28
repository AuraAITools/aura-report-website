import { FormField } from "@/components/forms/FormField";
import SelectFormField from "@/components/forms/SelectFormField";
import SelectMultipleFormField from "@/components/forms/SelectMultipleFormField";
import SubmitButton from "@/components/forms/SubmitButton";
import { useInstitutionAndOutletsContext } from "@/components/providers/InstitutionsAndOutletsProvider";
import { CoursesApis } from "@/lib/hooks/courses-queries";
import { EducatorsApis } from "@/lib/hooks/educators-queries";
import { LessonsApis } from "@/lib/hooks/lessons-queries";
import { StudentsApis } from "@/lib/hooks/students-queries";
import { CreateLessonParamsSchema } from "@/lib/requests/lesson";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
type CreateLessonFormProps = {
  onSuccess: () => void;
};

export const CreateLessonFormParamsSchema = z
  .object({
    start_date: z.coerce.date(),
    end_date: z.coerce.date(),
    start_time: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, {
      message: "Please enter a valid time in 24-hour format (HH:MM)",
    }),
    end_time: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, {
      message: "Please enter a valid time in 24-hour format (HH:MM)",
    }),
  })
  .merge(CreateLessonParamsSchema)
  .omit({
    lesson_start_timestamptz: true,
    lesson_end_timestamptz: true,
  })
  .transform((data) => {
    // Combine date and time for start
    const startDateTime = new Date(
      `${data.start_date.toISOString().split("T")[0]}T${data.start_time}:00`,
    );

    // Combine date and time for end
    const endDateTime = new Date(
      `${data.end_date.toISOString().split("T")[0]}T${data.end_time}:00`,
    );

    // Convert to timestamptz using browser's local timezone
    return {
      ...data,
      lesson_start_timestamptz: startDateTime.toISOString(),
      lesson_end_timestamptz: endDateTime.toISOString(),
    };
  });
export type CreateLessonFormParams = z.infer<
  typeof CreateLessonFormParamsSchema
>;
export default function CreateLessonForm(props: CreateLessonFormProps) {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<CreateLessonFormParams>({
    resolver: zodResolver(CreateLessonFormParamsSchema),
  });
  const { currentInstitution, currentOutlet } =
    useInstitutionAndOutletsContext();
  // get all educators
  const { data: educators = [] } = EducatorsApis.useGetAllEducatorsFromOutlet(
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

  const onSubmit: SubmitHandler<CreateLessonFormParams> = (params) => {
    // TODO: convert the form input into lesson_start_timestamptz and lesson_end_timestamptz
    console.log(JSON.stringify(params));
    createLesson(params, { onSuccess: props.onSuccess });
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)} className='grid grid-cols-3 gap-8'>
      <SelectFormField
        {...register("institution_id")}
        options={[
          {
            value: currentInstitution?.id ?? "loading",
            display: currentInstitution?.name ?? "loading",
          },
        ]}
        labelText='Institution'
        disabled
        name='institution_id'
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
        labelText='Outlets'
        disabled
        name='outlet_id'
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
        name='course_id'
        errorMessage={errors.course_id?.message}
        className='col-start-1'
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
        placeholder={"E.g. Mathematics Makeup Lesson"}
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
        className='col-span-2'
      />
      <FormField
        {...register("description")}
        labelText='Description'
        placeholder={"E.g. Makeup lesson due to public holiday"}
        type='text'
        errorMessage={errors.description?.message}
      />
      <FormField
        {...register("start_date")}
        labelText='Lesson Start Date'
        type='date'
        errorMessage={errors.start_date?.message}
      />
      <FormField
        {...register("start_time")}
        labelText='Lesson Start Time'
        type='time'
        errorMessage={errors.start_time?.message}
      />
      <FormField
        {...register("end_date")}
        labelText='Lesson End Date'
        type='date'
        errorMessage={errors.end_date?.message}
        className='col-start-1'
      />
      <FormField
        {...register("end_time")}
        labelText='Lesson End Time'
        type='time'
        errorMessage={errors.end_time?.message}
      />
      <div className='col-start-1 col-span-2' />
      <SubmitButton
        className='mt-8 w-full'
        disabled={isSubmitting}
        buttonTitle={"Create Lesson"}
        isSubmitting={isSubmitting}
      />
    </form>
  );
}
