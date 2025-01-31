import { FormField } from "@/components/forms/FormField";
import SelectFormField from "@/components/forms/SelectFormField";
import { CrossCircledIcon } from "@radix-ui/react-icons";
import { useFieldArray, useFormContext } from "react-hook-form";
import { MultipleStudentFormFields } from "./CreateMultipleStudentsForm";

export function DynamicCoursesFormFields({
  studentIdx,
  className,
  maxNumber,
}: {
  studentIdx: number;
  className: string;
  maxNumber: number;
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
  } = useFieldArray({ control, name: `students.${studentIdx}.courses` });

  return (
    <div className={`flex flex-col ${className}`}>
      <h1 className='font-semibold text-2xl text-center'>Register Classes</h1>
      {courseFields.map((cf, idx) => (
        <div className='grid grid-cols-6 gap-6' key={cf.id}>
          <SelectFormField
            options={["Class #1", "Class #2", "Class #3", "Class #4"]}
            labelText={`Enrolled Class #${idx + 1}`}
            id={cf.id}
            className='col-span-2'
            {...register(`students.${studentIdx}.courses.${idx}.name`)}
            errorMessage={
              errors.students?.[studentIdx]?.courses?.[idx]?.name?.message
            }
          />
          <FormField
            labelText='Start Date'
            type='date'
            id={cf.id}
            className='col-span-2'
            {...register(`students.${studentIdx}.courses.${idx}.start_date`)}
            errorMessage={
              errors.students?.[studentIdx]?.courses?.[idx]?.start_date?.message
            }
          />
          {courseFields.length > 1 && (
            <CrossCircledIcon
              className='inline-flex self-center size-6 text-gray-400 hover:text-gray-500'
              onClick={() => remove(idx)}
            />
          )}
        </div>
      ))}
      {courseFields.length < maxNumber && (
        <button
          className='rounded-full text-gray-400 border-gray-400 border-[1.5px] mt-4 p-2 max-w-[200px] hover:text-gray-500 hover:border-gray-500'
          type='button'
          onClick={() => append({ name: "", start_date: "" })}
        >
          Add more classes
        </button>
      )}
    </div>
  );
}
