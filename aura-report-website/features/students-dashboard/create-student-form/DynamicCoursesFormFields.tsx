import SelectFormField from "@/components/forms/SelectFormField";
import { CrossCircledIcon } from "@radix-ui/react-icons";
import { useFieldArray, useFormContext } from "react-hook-form";
import { MultipleStudentFormFields } from "./CreateMultipleStudentsForm";

export function DynamicCoursesFormFields({
  studentIdx,
  className,
  maxNumber,
  courseOptions,
}: {
  studentIdx: number;
  className: string;
  maxNumber: number;
  courseOptions: { id: string; value: string }[];
}) {
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext<MultipleStudentFormFields>();
  const {
    fields: courseFields,
    append,
    remove,
  } = useFieldArray({ control, name: `students.${studentIdx}.course_ids` });

  return (
    <div className={`flex flex-col ${className}`}>
      <h1 className='font-semibold text-2xl text-center'>Register Classes</h1>
      {courseFields.map((cf, idx) => (
        <div className='grid grid-cols-6 gap-6' key={cf.id}>
          <SelectFormField
            options={courseOptions.map((c) => ({
              value: c.id,
              display: c.value,
            }))}
            labelText={`Enrolled Class #${idx + 1}`}
            id={cf.id}
            className='col-span-2'
            {...register(`students.${studentIdx}.course_ids.${idx}`)}
            errorMessage={
              errors.students?.[studentIdx]?.course_ids?.[idx]?.message
            }
          />
          {/* <FormField
            labelText='Start Date'
            type='date'
            id={cf.id}
            className='col-span-2'
            {...register(`students.${studentIdx}.course_ids.${idx}.start_date`)}
            errorMessage={
              errors.students?.[studentIdx]?.courses?.[idx]?.start_date?.message
            }
          /> */}
          {/* TODO: implement start date */}
          <CrossCircledIcon
            className='inline-flex self-center size-6 text-gray-400 hover:text-gray-500'
            onClick={() => remove(idx)}
          />
        </div>
      ))}
      {courseFields.length < maxNumber && (
        <button
          className='rounded-full text-gray-400 border-gray-400 border-[1.5px] mt-4 p-2 max-w-[200px] hover:text-gray-500 hover:border-gray-500'
          type='button'
          onClick={() => append({})}
        >
          Add more classes
        </button>
      )}
    </div>
  );
}
