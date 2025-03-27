"use client";

import { FormField } from "@/components/forms/FormField";
import SelectFormField from "@/components/forms/SelectFormField";
import SelectMultipleFormField from "@/components/forms/SelectMultipleFormField";
import SubmitButton from "@/components/forms/SubmitButton";
import { useInstitutionAndOutletsContext } from "@/components/providers/InstitutionsAndOutletsProvider";
import { useCreateCourseInOutlet } from "@/lib/hooks/courses-queries";
import { LevelsApis } from "@/lib/hooks/levels-queries";
import { SubjectsApis } from "@/lib/hooks/subject-queries";
import {
  CreateCourseParams,
  CreateCourseParamsSchema,
} from "@/lib/requests/courses";
import { PRICE_FREQUENCIES } from "@/types/data/Course";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
type CreateClassesFormProps = {
  onSuccess: () => void;
};
export default function CreateClassesForm(props: CreateClassesFormProps) {
  const { currentInstitution, currentOutlets, currentOutlet } =
    useInstitutionAndOutletsContext();
  const { data: levels = [], status: levelFetchingStatus } =
    LevelsApis.useGetAllLevelsOfInstitution(currentInstitution?.id);
  const { data: subjects = [], status: subjectFetchingStatus } =
    SubjectsApis.useGetAllSubjectsOfInstitution(currentInstitution?.id);
  const { mutate: createCourse } = useCreateCourseInOutlet();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<CreateCourseParams>({
    resolver: zodResolver(CreateCourseParamsSchema), //include validation in future
  });

  const onSubmit: SubmitHandler<CreateCourseParams> = async (data) => {
    console.log(`submitted data ${JSON.stringify(data, null, 2)}`);
    createCourse({ ...data }, { onSuccess: props.onSuccess });
  };

  if (levelFetchingStatus === "error" || subjectFetchingStatus === "error") {
    throw new Error("failed to load levels");
  }

  const unfocusedOutlets = currentOutlets.filter(
    (outlet) => outlet.id !== currentOutlet!.id,
  );
  const outletOptions = [currentOutlet!, ...unfocusedOutlets];
  return (
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
        errorMessage={errors.institution_id?.message}
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
        errorMessage={errors.outlet_id?.message}
      />
      <SelectFormField
        options={levels.map((lvl) => ({ display: lvl.name, value: lvl.id }))}
        {...register("level_id")}
        labelText='Level'
        type='text'
        className='col-span-4 row-start-2 px-4'
        errorMessage={errors.level_id?.message}
      />
      <SelectMultipleFormField
        formFieldName={""}
        options={subjects.map((sub) => ({
          value: sub.id,
          display: sub.name,
        }))}
        {...register("subject_ids")}
        labelText='Subject'
        type='text'
        className='col-span-4 row-start-2 px-4'
        errorMessage={errors.subject_ids?.message}
      />
      <FormField
        {...register("name")}
        labelText='Class Name (Optional)'
        placeholder={"i.e. Intensive Revision Package"}
        type='text'
        className='col-span-4 px-4'
        errorMessage={errors.name?.message}
      />
      <FormField
        {...register("max_size", { valueAsNumber: true })}
        labelText='Max Class Size (Optional)'
        min={1}
        max={100}
        placeholder={"1"}
        type='number'
        className='col-span-2 px-4'
        errorMessage={errors.max_size?.message}
      />
      <FormField
        {...register("price", { valueAsNumber: true })}
        labelText='price'
        min={0}
        max={100000}
        type='number'
        className='col-span-1 px-4'
        errorMessage={errors.price?.message}
      />
      <SelectFormField
        options={PRICE_FREQUENCIES.map((pf) => ({ display: pf, value: pf }))}
        {...register("price_frequency")}
        placeholder={"Monthly"}
        labelText='Frequency'
        type='text'
        className='col-span-1 px-4'
        errorMessage={errors.price_frequency?.message}
      />
      <FormField
        {...register("start_date")}
        labelText='Start Date'
        type='date'
        min={new Date().toISOString().split("T").at(0)}
        className='row-start-4 col-span-2 px-4'
        errorMessage={errors.start_date?.message}
      />
      <FormField
        {...register("end_date")}
        labelText='End Date (Optional)'
        type='date'
        min={new Date().toISOString().split("T").at(0)}
        className='row-start-4 col-span-2 px-4'
        errorMessage={errors.end_date?.message}
      />
      <FormField
        {...register("start_time")}
        labelText='Start Time'
        type='time'
        className='row-start-4 col-span-2 px-4'
        errorMessage={errors.start_time?.message}
      />
      <FormField
        {...register("end_time")}
        labelText='End Time'
        type='time'
        className='row-start-4 col-span-2 px-4'
        errorMessage={errors.end_time?.message}
      />

      <FormField
        {...register("lesson_number_frequency", { valueAsNumber: true })}
        labelText='lessons'
        type='number'
        defaultValue={1}
        min={1}
        className='row-start-5 col-span-1 px-4'
        errorMessage={errors.lesson_number_frequency?.message}
      />

      <FormField
        {...register("lesson_weekly_frequency", { valueAsNumber: true })}
        labelText='weekly'
        type='number'
        defaultValue={1}
        min={1}
        className='row-start-5 col-span-1 px-4'
        errorMessage={errors.lesson_weekly_frequency?.message}
      />

      <div className='row-start-6 pl-4 pt-2 col-span-full'>
        <SubmitButton
          className='w-full'
          disabled={isSubmitting}
          buttonTitle={"Create Course"}
          isSubmitting={isSubmitting}
        />
      </div>
    </form>
  );
}
