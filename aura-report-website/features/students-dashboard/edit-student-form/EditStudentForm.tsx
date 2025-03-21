import { FormField } from "@/components/forms/FormField";
import SelectFormField from "@/components/forms/SelectFormField";
import React from "react";
import { StudentWithAssociations } from "@/types/data/Student";
import { z } from "zod";
import { useInstitutionAndOutletsContext } from "@/components/providers/InstitutionsAndOutletsProvider";
import { LevelsApis } from "@/lib/hooks/levels-queries";
import { CoursesApis } from "@/lib/hooks/courses-queries";
import { SubmitHandler, useForm } from "react-hook-form";
import SelectMultipleFormField from "@/components/forms/SelectMultipleFormField";
import SubmitButton from "@/components/forms/SubmitButton";
import { StudentsApis } from "@/lib/hooks/students-queries";

export const UpdateStudentParamsSchema = z.object({
  institution_id: z.string().uuid(),
  student_id: z.string().uuid(),
  name: z.string().optional(),
  date_of_birth: z.coerce.date().optional(),
  current_school: z.string().optional(),
  level_id: z.string().uuid(),
  outlet_ids: z.string().uuid().array(),
  course_ids: z.string().uuid().array(),
});

export type UpdateStudentParams = z.infer<typeof UpdateStudentParamsSchema>;

export type EditStudentFormProps = {
  student: StudentWithAssociations;
};
export default function EditStudentForm({ student }: EditStudentFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<UpdateStudentParams>();
  const { currentInstitution, outlets, currentOutlet } =
    useInstitutionAndOutletsContext();
  const { data: levels = [] } = LevelsApis.useGetAllLevelsOfInstitution(
    currentInstitution?.id,
  );
  const { data: courses = [] } = CoursesApis.useGetAllCoursesFromOutlet(
    currentInstitution?.id,
    currentOutlet?.id,
  );

  const { mutate: updateStudent, isPending } =
    StudentsApis.useUpdateStudentInInstitution();
  const onSubmit: SubmitHandler<UpdateStudentParams> = (params) => {
    console.log(JSON.stringify(params));
    updateStudent({ ...params, student_id: student.id });
  };

  return (
    <form
      className='grid grid-cols-6 gap-6 py-4'
      onSubmit={handleSubmit(onSubmit)}
    >
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
      <FormField
        labelText='Account Email'
        disabled
        value={student.email}
        className='col-span-2 row-start-1 text-gray-300 pointer-events-none'
      />
      <FormField
        {...register(`name`)}
        labelText={`name`}
        className='col-span-2 row-start-1'
        defaultValue={student.name}
      />
      <FormField
        {...register(`date_of_birth`)}
        labelText='Date of Birth'
        defaultValue={student.date_of_birth.toString()}
        type='date'
        className='col-span-2 row-start-1'
      />
      <FormField
        {...register(`current_school`)}
        labelText='Current School'
        type='text'
        className='col-span-2 row-start-2'
        defaultValue={student.current_school}
      />

      <SelectFormField
        {...register(`level_id`)}
        labelText='Schooling Level'
        type='select'
        options={levels?.map((lvl) => ({ display: lvl.name, value: lvl.id }))}
        defaultValue={student.current_level?.id ?? null}
        className='col-span-2 row-start-2'
        errorMessage={errors.student_id?.message}
      />

      <SelectMultipleFormField
        {...register("outlet_ids")}
        labelText={"Outlet(s)"}
        options={
          outlets?.map((outlet) => ({
            value: outlet.id,
            display: outlet.name,
          })) ?? []
        }
        defaultValue={student.outlets.map((outlet) => outlet.id)}
        formFieldName={""}
      />

      <SelectMultipleFormField
        {...register("course_ids")}
        labelText={"registered courses"}
        options={courses?.map((course) => ({
          display: course.name,
          value: course.id,
        }))}
        defaultValue={student.courses.map((course) => course.id)}
        className='row-start-2 col-span-2'
        errorMessage={errors.course_ids?.message}
        formFieldName={""}
      />
      <SubmitButton
        disabled={isSubmitting || isPending}
        buttonTitle={"save"}
        isSubmitting={isSubmitting || isPending}
      />
    </form>
  );
}
