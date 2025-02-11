"use client";

import { FormField } from "@/components/forms/FormField";
import SelectFormField from "@/components/forms/SelectFormField";
import { useInstitutionAndOutletsContext } from "@/components/providers/InstitutionsAndOutletsProvider";
import ProgressBar from "@/components/ui/progress-bar/ProgressBar";
import { useCreateCourseInOutlet } from "@/lib/hooks/courses-queries";
import { LevelsApis } from "@/lib/hooks/levels-queries";
import { SubjectsApi } from "@/lib/hooks/subject-queries";
import { CreateCourseParams } from "@/lib/requests/courses";
import { DAYS, PRICE_FREQUENCIES } from "@/types/data/Course";
import { generateKey } from "@/utils/id";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

// const formFieldSchema = z.object({
//   institution: z.string(),
//   outlet: z.string(),
//   level: z.string(),
//   subject: z.string(),
//   price: z.string(),
//   price_frequency: z.enum(PRICE_FREQUENCIES),
//   max_class_size: z.string().optional(),
//   class_name: z.string(),
//   //   educator: z.string().optional(),
//   start_date: z.string().date(),
//   end_date: z.string().date(),
//   lesson_start_time: z.string(),
//   lesson_end_time: z.string(),
//   lesson_frequency: z.object({
//     day: z.enum(DAYS),
//     unit: z.enum(LESSON_FREQ_UNIT),
//     freq: z.string(),
//   }),
// });

// type FormFields = z.infer<typeof formFieldSchema>;

export default function CreateClassesForm() {
  const [lessonGenerationTemplateNumber, setLessonGenerationTemplateNumber] =
    useState<number>(1);
  const { currentInstitution, currentOutlets, currentOutlet, status } =
    useInstitutionAndOutletsContext();
  const { data: levels, status: levelFetchingStatus } =
    LevelsApis.useGetAllLevelsOfInstitution(currentInstitution?.id);
  const { data: subjects, status: subjectFetchingStatus } =
    SubjectsApi.useGetAllSubjectsOfInstitution(currentInstitution?.id);
  const { mutate } = useCreateCourseInOutlet();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<CreateCourseParams>({
    // resolver: zodResolver(formFieldSchema), //include validation in future
  });

  const onSubmit: SubmitHandler<CreateCourseParams> = async (data) => {
    console.log(`submitted data ${JSON.stringify(data, null, 2)}`);
    mutate({
      ...data,
    });
    console.log("submitting");
    console.log(`data: ${JSON.stringify(data)}`);
  };

  if (
    levelFetchingStatus === "pending" ||
    subjectFetchingStatus === "pending" ||
    status === "pending"
  ) {
    return <ProgressBar />;
  }

  if (levelFetchingStatus === "error" || subjectFetchingStatus === "error") {
    throw new Error("failed to load levels");
  }

  const unfocusedOutlets = currentOutlets.filter(
    (outlet) => outlet.id !== currentOutlet!.id,
  );
  const outletOptions = [currentOutlet!, ...unfocusedOutlets];
  return (
    <div>
      <form
        className='grid grid-cols-8 grid-rows-6'
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
          className='col-span-4 row-start-1 px-4'
        />
        <SelectFormField
          options={outletOptions.map((o) => ({
            value: o.id,
            display: o.name,
          }))}
          {...register("outlet_id")}
          labelText='Location/Outlet'
          type='text'
          className='col-span-4 row-start-1 px-4'
        />
        <SelectFormField
          options={levels.map((lvl) => ({ display: lvl.name, value: lvl.id }))}
          {...register("level_id")}
          labelText='Level'
          type='text'
          className='col-span-4 row-start-2 px-4'
        />
        <SelectFormField
          options={subjects.map((sub) => ({
            value: sub.id,
            display: sub.name,
          }))}
          multiple // TODO: make a nicer multiple input UI
          {...register("subject_ids")}
          labelText='Subject'
          type='text'
          className='col-span-4 row-start-2 px-4'
        />
        <FormField
          {...register("name")}
          labelText='Class Name (Optional)'
          placeholder={"i.e. Intensive Revision Package"}
          type='text'
          className='col-span-4 px-4'
        />
        <FormField
          {...register("max_size")}
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
          options={PRICE_FREQUENCIES.map((pf) => ({ display: pf, value: pf }))}
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
          {...register("start_time")}
          labelText='Start Time'
          type='time'
          className='row-start-4 col-span-2 px-4'
        />
        <FormField
          {...register("end_time")}
          labelText='End Time'
          type='time'
          className='row-start-4 col-span-2 px-4'
        />

        <FormField
          {...register("lesson_number_frequency")}
          labelText='lesson frequency'
          type='number'
          defaultValue={1}
          min={1}
          onChange={(e) => {
            setLessonGenerationTemplateNumber(Number(e.target.value));
          }}
          className='row-start-5 col-span-1 px-4'
        />

        <FormField
          {...register("lesson_weekly_frequency")}
          labelText='weekly'
          type='number'
          defaultValue={1}
          min={1}
          className='row-start-5 col-span-1 px-4'
        />

        {/* TODO: even after the lesson form is removed, the form input is not unregistered */}
        {[...Array(lessonGenerationTemplateNumber)].map((i, idx) => {
          return (
            // TODO: make better form
            <div
              key={generateKey(
                "lesson_generation_templates",
                i,
                idx.toString(),
              )}
              className='flex'
            >
              <SelectFormField
                options={DAYS.map((d) => ({
                  value: d,
                  display: d.toLowerCase(),
                }))}
                {...register(`lesson_generation_templates.${idx}.day_of_week`)}
                labelText={`lesson #${idx + 1} day`}
                defaultValue={DAYS[0]}
                className='row-start-5 col-span-1 px-4'
              />

              <FormField
                key={generateKey(
                  `lesson_generation_templates.${idx}.week_number`,
                  i,
                  idx.toString(),
                )}
                {...register(`lesson_generation_templates.${idx}.week_number`)}
                labelText={`lesson week number#${idx + 1}`}
                type='number'
                defaultValue={1}
                min={1}
                className='row-start-5 col-span-1 px-4'
              />
              <FormField
                key={generateKey(
                  `lesson_generation_templates.${idx}.start_time`,
                  i,
                  idx.toString(),
                )}
                {...register(`lesson_generation_templates.${idx}.start_time`)}
                labelText={`start time lesson number#${idx + 1}`}
                type='time'
                className='row-start-5 col-span-1 px-4'
              />
              <FormField
                key={generateKey(
                  `lesson_generation_templates.${idx}.end_time`,
                  i,
                  idx.toString(),
                )}
                {...register(`lesson_generation_templates.${idx}.end_time`)}
                labelText={`end time lesson number#${idx + 1}`}
                type='time'
                className='row-start-5 col-span-1 px-4'
              />
            </div>
          );
        })}
        {/* <SelectFormField
          options={LESSON_FREQ_UNIT.map((lf) => ({ display: lf, value: lf }))}
          {...register("lesson_freq_unit")}
          labelText='freq unit'
          type='text'
          className='row-start-5 col-span-1 px-4'
        /> */}
        {errors.root && <div>{errors.root.message}</div>}
        {errors.institution_id && <div>{errors.institution_id.message}</div>}
        {errors.level_id && <div>{errors.level_id.message}</div>}
        {errors.subject_ids && <div>{errors.subject_ids.message}</div>}
        {errors.name && <div>{errors.name.message}</div>}
        {errors.max_size && <div>{errors.max_size.message}</div>}
        {errors.price && <div>{errors.price.message}</div>}
        {errors.price_frequency && <div>{errors.price_frequency.message}</div>}
        {errors.start_date && <div>{errors.start_date.message}</div>}
        {errors.end_date && <div>{errors.end_date.message}</div>}
        {errors.start_time && <div>{errors.start_time.message}</div>}
        {errors.end_time && <div>{errors.end_time.message}</div>}
        {/* {errors.lesson_freq && <div>{errors.lesson_freq.message}</div>}
        {errors.lesson_freq_day && <div>{errors.lesson_freq_day.message}</div>}
        {errors.lesson_freq_unit && (
          <div>{errors.lesson_freq_unit.message}</div>
        )} */}

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
