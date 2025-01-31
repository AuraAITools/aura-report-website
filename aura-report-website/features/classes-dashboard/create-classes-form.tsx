"use client";

import { FormField } from "@/components/forms/FormField";
import SelectFormField from "@/components/forms/SelectFormField";
import { useInstitutionAndOutletsContext } from "@/components/providers/InstitutionsAndOutletsProvider";
import ProgressBar from "@/components/ui/progress-bar/ProgressBar";
import useGetAllLevels from "@/lib/hooks/useLevels";
import { useGetAllSubjects } from "@/lib/hooks/useSubjects";
import { DAYS, LESSON_FREQ_UNIT, PRICE_FREQUENCIES } from "@/types/data/Course";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";

const formFieldSchema = z.object({
  institution: z.string(),
  outlet: z.string(),
  level: z.string(),
  subject: z.string(),
  price: z.string(),
  price_frequency: z.enum(PRICE_FREQUENCIES),
  max_class_size: z.string().optional(),
  class_name: z.string(),
  //   educator: z.string().optional(),
  start_date: z.string().date(),
  end_date: z.string().date(),
  lesson_start_time: z.string(),
  lesson_end_time: z.string(),
  lesson_frequency: z.object({
    day: z.enum(DAYS),
    unit: z.enum(LESSON_FREQ_UNIT),
    freq: z.string(),
  }),
});

type FormFields = z.infer<typeof formFieldSchema>;

export default function CreateClassesForm() {
  const { data: levels, status: levelFetchingStatus } = useGetAllLevels();
  const { data: subjects, status: subjectFetchingStatus } = useGetAllSubjects();
  const { currentInstitution: institution, status: institutionFetchingStatus } =
    useInstitutionAndOutletsContext();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<FormFields>({
    resolver: zodResolver(formFieldSchema), //include validation in future
  });

  const onSubmit: SubmitHandler<FormFields> = async (data) => {
    console.log("submitting");
    console.log(`data: ${JSON.stringify(data)}`);
  };

  if (
    levelFetchingStatus === "pending" ||
    subjectFetchingStatus === "pending" ||
    institutionFetchingStatus === "pending"
  ) {
    return <ProgressBar />;
  }

  if (
    levelFetchingStatus === "error" ||
    subjectFetchingStatus === "error" ||
    institutionFetchingStatus === "error"
  ) {
    throw new Error("failed to load levels");
  }

  return (
    <div>
      <form
        className='grid grid-cols-8 grid-rows-6'
        onSubmit={handleSubmit(onSubmit)}
      >
        <FormField
          {...register("institution")}
          labelText='institution'
          placeholder={institution.name}
          disabled
          type='text'
          className='col-span-4 row-start-1 px-4'
        />
        <SelectFormField
          options={["Yishun Ave 4", "Marina Bay"]}
          {...register("outlet")}
          labelText='Location/Outlet'
          disabled
          type='text'
          className='col-span-4 row-start-1 px-4'
        />
        <SelectFormField
          options={levels.map((lvl) => lvl.name)}
          {...register("level")}
          labelText='Level'
          type='text'
          className='col-span-4 row-start-2 px-4'
        />
        <SelectFormField
          options={subjects.map((sub) => sub.name)}
          {...register("subject")}
          labelText='Subject'
          type='text'
          className='col-span-4 row-start-2 px-4'
        />
        <FormField
          {...register("class_name")}
          labelText='Class Name (Optional)'
          placeholder={"i.e. Intensive Revision Package"}
          type='text'
          className='col-span-4 px-4'
        />
        <FormField
          {...register("max_class_size")}
          labelText='Max Class Size (Optional)'
          min={1}
          max={100}
          placeholder={"1"}
          type='number'
          className='col-span-2 px-4'
        />
        <FormField
          {...register("price")}
          labelText='price'
          min={0}
          max={100000}
          type='number'
          className='col-span-1 px-4'
        />
        <SelectFormField
          options={["Month", "Week", "Lesson", "Total"]}
          {...register("price_frequency")}
          placeholder={"Monthly"}
          labelText='Frequency'
          type='text'
          className='col-span-1 px-4'
        />
        <FormField
          {...register("start_date")}
          labelText='Start Date'
          type='date'
          min={new Date().toISOString().split("T").at(0)}
          className='row-start-4 col-span-2 px-4'
        />
        <FormField
          {...register("end_date")}
          labelText='End Date (Optional)'
          type='date'
          min={new Date().toISOString().split("T").at(0)}
          className='row-start-4 col-span-2 px-4'
        />
        <FormField
          {...register("lesson_start_time")}
          labelText='Start Time'
          type='time'
          className='row-start-4 col-span-2 px-4'
        />
        <FormField
          {...register("lesson_end_time")}
          labelText='End Time'
          type='time'
          className='row-start-4 col-span-2 px-4'
        />
        <FormField
          {...register("lesson_frequency.freq")}
          labelText='freq'
          min={1}
          max={100}
          placeholder={"1"}
          type='number'
          className='row-start-5 col-span-1 px-4'
        />
        <SelectFormField
          options={[...DAYS]}
          {...register("lesson_frequency.day")}
          labelText='freq day'
          type='text'
          className='row-start-5 col-span-1 px-4'
        />
        <SelectFormField
          options={[...LESSON_FREQ_UNIT]}
          {...register("lesson_frequency.unit")}
          labelText='freq unit'
          type='text'
          className='row-start-5 col-span-1 px-4'
        />
        {errors.root && <div>{errors.root.message}</div>}
        {errors.institution && <div>{errors.institution.message}</div>}
        {errors.level && <div>{errors.level.message}</div>}
        {errors.subject && <div>{errors.subject.message}</div>}
        {errors.class_name && <div>{errors.class_name.message}</div>}
        {errors.max_class_size && <div>{errors.max_class_size.message}</div>}
        {errors.price && <div>{errors.price.message}</div>}
        {errors.price_frequency && <div>{errors.price_frequency.message}</div>}
        {errors.start_date && <div>{errors.start_date.message}</div>}
        {errors.end_date && <div>{errors.end_date.message}</div>}
        {errors.lesson_start_time && (
          <div>{errors.lesson_start_time.message}</div>
        )}
        {errors.lesson_end_time && <div>{errors.lesson_end_time.message}</div>}
        {errors.lesson_frequency?.freq && (
          <div>{errors.lesson_frequency?.freq.message}</div>
        )}
        {errors.lesson_frequency?.day && (
          <div>{errors.lesson_frequency?.day.message}</div>
        )}
        {errors.lesson_frequency?.unit && (
          <div>{errors.lesson_frequency?.unit.message}</div>
        )}

        <button
          type='submit'
          className='row-start-6 mx-4 mt-4 col-span-full bg-orange-300 text-white rounded-lg hover:bg-orange-400'
          disabled={isSubmitting}
        >
          Create Class
        </button>
      </form>
    </div>
  );
}
