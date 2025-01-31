import { FormField } from "@/components/forms/FormField";
import SelectFormField from "@/components/forms/SelectFormField";
import { useFormContext } from "react-hook-form";
import { MultipleStudentFormFields } from "./CreateMultipleStudentsForm";
import { DynamicCoursesFormFields } from "./DynamicCoursesFormFields";

type CreateStudentFormProps = {
  index: number;
};
export function CreateStudentForm({ index }: CreateStudentFormProps) {
  const {
    register,
    formState: { errors },
  } = useFormContext<MultipleStudentFormFields>();

  return (
    <div className='grid grid-cols-6 gap-6 py-4'>
      <FormField
        {...register(`students.${index}.email`)}
        labelText='Account Email'
        disabled
        className='col-span-2 row-start-1 text-gray-300 pointer-events-none'
        errorMessage={errors.students?.[index]?.email?.message}
      />
      <FormField
        {...register(`students.${index}.name`)}
        labelText={`Student #${Number(index) + 1}'s name`}
        className='col-span-2 row-start-1'
        errorMessage={errors.students?.[index]?.name?.message}
      />
      <FormField
        {...register(`students.${index}.dateOfBirth`)}
        labelText='Date of Birth'
        placeholder='14/09/1998'
        type='date'
        className='col-span-2 row-start-1'
        errorMessage={errors.students?.[index]?.dateOfBirth?.message}
      />
      <SelectFormField
        {...register(`students.${index}.level.name`)}
        labelText='Schooling Level'
        type='select'
        options={["sec 1", "sec 2", "sec 3", "sec 4"]}
        className='col-span-2 row-start-2'
        errorMessage={errors.students?.[index]?.level?.name?.message}
      />
      <SelectFormField
        {...register(`students.${index}.currentSchool`)}
        labelText='Current School'
        type='select'
        options={["Chung Cheng High (Yishun)", "Orchid Park Secondary"]}
        className='row-start-2 col-span-2'
        errorMessage={errors.students?.[index]?.currentSchool?.message}
      />
      {/* dynamic form field for classes */}
      <DynamicCoursesFormFields
        maxNumber={5}
        className='row-start-3 col-span-full'
        studentIdx={Number(index)}
      />
    </div>
  );
}
