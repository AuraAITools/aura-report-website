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

  const onSubmit: SubmitHandler<CreateLessonFormParams> = (params) => {
    // TODO: convert the form input into lesson_start_timestamptz and lesson_end_timestamptz
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
        options={
          courses.length === 0
            ? [
                {
                  value: "No Courses",
                  display: "No Courses",
                },
              ]
            : courses.map((course) => ({
                value: course.id,
                display: course.name,
              }))
        }
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
        {...register("start_date")}
        labelText='lesson start date'
        type='date'
        errorMessage={errors.start_date?.message}
      />
      <FormField
        {...register("end_date")}
        labelText='lesson end date'
        type='date'
        errorMessage={errors.end_date?.message}
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
      <SubmitButton
        className='mt-2 w-full'
        disabled={isSubmitting}
        buttonTitle={"Create Lesson"}
        isSubmitting={isSubmitting}
      />
    </form>
  );
}
