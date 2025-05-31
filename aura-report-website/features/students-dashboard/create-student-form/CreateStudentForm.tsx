import { FormField } from "@/components/forms/FormField";
import SelectFormField from "@/components/forms/SelectFormField";
import { CreateStudentsInAccountParams } from "@/lib/requests/students";
import { useFormContext } from "react-hook-form";
import { DynamicCoursesFormFields } from "./DynamicCoursesFormFields";

type CreateStudentFormProps = {
  index: number;
  accountEmail: string;
  levelOptions: { id: string; value: string }[];
  courseOptions: { id: string; value: string }[];
  schoolOptions: { id: string; value: string }[];
  outletOptions: { id: string; value: string }[];
};
export function CreateStudentForm({
  index,
  levelOptions = [],
  courseOptions = [],
  schoolOptions = [],
  outletOptions = [],
  accountEmail,
}: CreateStudentFormProps) {
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext<CreateStudentsInAccountParams>();

  return (
    <div className='grid grid-cols-6 gap-6 py-4'>
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
        control={control}
        name={`students.${index}.level_id`}
        labelText='Schooling Level'
        options={levelOptions.map((i) => ({ display: i.value, value: i.id }))}
        className='col-span-2 row-start-2'
        errorMessage={errors.students?.[index]?.level_id?.message}
      />
      <SelectFormField
        control={control}
        name={`students.${index}.school_id`}
        labelText='Current School'
        options={schoolOptions.map((i) => ({ display: i.value, value: i.id }))}
        className='row-start-2 col-span-2'
        // defaultChecked
        errorMessage={errors.students?.[index]?.school_id?.message}
      />
      <SelectFormField
        control={control}
        name={`students.${index}.outlet_id`}
        labelText='outlet'
        disabled
        options={outletOptions.map((i) => ({ display: i.value, value: i.id }))}
        defaultValue={outletOptions ? outletOptions.at(0)?.value : "no outlets"}
        className='row-start-3 col-span-2'
        errorMessage={errors.students?.[index]?.outlet_id?.message}
      />
      {/* dynamic form field for classes */}
      <DynamicCoursesFormFields
        courseOptions={courseOptions}
        maxNumber={5}
        className='row-start-4 col-span-full'
        studentIdx={Number(index)}
      />
    </div>
  );
}
