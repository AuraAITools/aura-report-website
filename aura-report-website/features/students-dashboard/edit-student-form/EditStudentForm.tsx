import { FormField } from "@/components/forms/FormField";
import SelectFormField from "@/components/forms/SelectFormField";
import SelectMultipleFormField from "@/components/forms/SelectMultipleFormField";
import SubmitButton from "@/components/forms/SubmitButton";
import { useInstitutionAndOutletsContext } from "@/components/providers/InstitutionsAndOutletsProvider";
import { CoursesApis } from "@/lib/hooks/courses-queries";
import { LevelsApis } from "@/lib/hooks/levels-queries";
import { StudentsApis } from "@/lib/hooks/students-queries";
import { UpdateStudentParams } from "@/lib/requests/students";
import { ExpandedStudent } from "@/types/data/Student";
import { SubmitHandler, useForm } from "react-hook-form";

export type EditStudentFormProps = {
  student: ExpandedStudent;
};
export default function EditStudentForm({ student }: EditStudentFormProps) {
  const {
    register,
    control,
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
        control={control}
        name='institution_id'
        options={[
          {
            value: currentInstitution?.id ?? "loading",
            display: currentInstitution?.name ?? "loading",
          },
        ]}
        labelText='institution'
        disabled
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
        defaultValue={student.school}
      />

      <SelectFormField
        control={control}
        name='level_id'
        labelText='Schooling Level'
        options={levels?.map((lvl) => ({ display: lvl.name, value: lvl.id }))}
        defaultValue={student.level?.id ?? null}
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
        formFieldName={""}
      />

      <SelectMultipleFormField
        {...register("course_ids")}
        labelText={"registered courses"}
        options={courses?.map((course) => ({
          display: course.name,
          value: course.id,
        }))}
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
