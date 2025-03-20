import { FormField } from "@/components/forms/FormField";
import SelectFormField from "@/components/forms/SelectFormField";
import SelectMultipleFormField from "@/components/forms/SelectMultipleFormField";
import SubmitButton from "@/components/forms/SubmitButton";
import { useInstitutionAndOutletsContext } from "@/components/providers/InstitutionsAndOutletsProvider";
import { EducatorsApis } from "@/lib/hooks/educators-queries";
import { LessonsApis } from "@/lib/hooks/lessons-queries";
import { StudentsApis } from "@/lib/hooks/students-queries";
import { CreateLessonParams } from "@/lib/requests/lesson";
import { ExpandedLesson, LESSON_STATUS } from "@/types/data/Lesson";
import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";

export type EditLessonDetailsFormProps = {
  lesson: ExpandedLesson;
};
export default function EditLessonDetailsForm({
  lesson,
}: EditLessonDetailsFormProps) {
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
  const { mutate: updateLesson } = LessonsApis.useUpdateLessonInOutlet();
  const onSubmit: SubmitHandler<CreateLessonParams> = (params) => {
    console.log(JSON.stringify(params));
    updateLesson({ lesson_id: lesson.id, ...params });
  };
  return (
    <div>
      <h1 className='inline-flex w-full justify-center'>
        <strong className='text-2xl'>Edit Lesson</strong>
      </h1>
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
        <SelectFormField
          {...register("course_id")}
          options={[
            {
              value: lesson.course.id,
              display: lesson.course.name,
            },
          ]}
          labelText='Course'
          disabled
          type='text'
          className='w-1/2'
        />
        <SelectFormField
          {...register("status")}
          options={LESSON_STATUS.map((status) => ({
            display: status,
            value: status,
          }))}
          defaultValue={[lesson.status]}
          labelText='Course'
          type='text'
          className='w-1/2'
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
          defaultValue={lesson.educators.map((edu) => edu.id)}
          formFieldName={""}
        />
        <FormField
          {...register("name")}
          labelText='Lesson Name (Optional)'
          placeholder={"i.e. lesson name"}
          type='text'
          value={lesson.name}
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
          defaultValue={lesson.students.map((student) => student.id)}
          formFieldName={""}
        />
        <FormField
          {...register("description")}
          labelText='description'
          value={lesson.description}
          placeholder={"i.e. description"}
          type='text'
          className='w-1/2'
        />
        <FormField
          {...register("date")}
          labelText='lesson date'
          value={lesson.date}
          type='date'
          className='w-1/2'
        />
        <FormField
          {...register("start_time")}
          labelText='lesson start time'
          type='time'
          value={lesson.start_time}
          className='w-1/2'
        />
        <FormField
          {...register("end_time")}
          labelText='lesson end time'
          type='time'
          value={lesson.end_time}
          className='w-1/2'
        />
        <SubmitButton
          disabled={isSubmitting}
          buttonTitle={"Save"}
          isSubmitting={isSubmitting}
        />
      </form>
    </div>
  );
}
