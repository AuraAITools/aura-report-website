import { FormField } from "@/components/forms/FormField";
import SelectFormField from "@/components/forms/SelectFormField";
import { useFormContext } from "react-hook-form";
import { MultipleStudentFormFields } from "./CreateMultipleStudentsForm";
import { DynamicCoursesFormFields } from "./DynamicCoursesFormFields";

type CreateStudentFormProps = {
  index: number;
  accountEmail: string;
  levelOptions: { id: string; value: string }[];
  courseOptions: { id: string; value: string }[];
};
export function CreateStudentForm({
  index,
  levelOptions,
  courseOptions,
  accountEmail,
}: CreateStudentFormProps) {
  const {
    register,
    formState: { errors },
  } = useFormContext<MultipleStudentFormFields>();

  return (
    <div className='grid grid-cols-6 gap-6 py-4'>
      <FormField
        labelText='Account Email'
        disabled
        value={accountEmail}
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
        {...register(`students.${index}.date_of_birth`)}
        labelText='Date of Birth'
        placeholder='14/09/1998'
        type='date'
        className='col-span-2 row-start-1'
        errorMessage={errors.students?.[index]?.date_of_birth?.message}
      />
      <FormField
        {...register(`students.${index}.email`)}
        labelText='Email'
        type='email'
        className='col-span-2 row-start-2'
        errorMessage={errors.students?.[index]?.email?.message}
      />
      <SelectFormField
        {...register(`students.${index}.level_id`)}
        labelText='Schooling Level'
        type='select'
        options={levelOptions.map((i) => ({ display: i.value, value: i.id }))}
        className='col-span-2 row-start-2'
        errorMessage={errors.students?.[index]?.level_id?.message}
      />
      <SelectFormField
        {...register(`students.${index}.current_school`)}
        labelText='Current School'
        type='select'
        options={[
          {
            value: "Chung Cheng High (Yishun)",
            display: "Chung Cheng High (Yishun)",
          },
          {
            value: "Orchid Park Secondary",
            display: "Orchid Park Secondary",
          },
        ]}
        className='row-start-2 col-span-2'
        errorMessage={errors.students?.[index]?.current_school?.message}
      />
      {/* dynamic form field for classes */}
      <DynamicCoursesFormFields
        courseOptions={courseOptions}
        maxNumber={5}
        className='row-start-3 col-span-full'
        studentIdx={Number(index)}
      />
    </div>
  );
}
