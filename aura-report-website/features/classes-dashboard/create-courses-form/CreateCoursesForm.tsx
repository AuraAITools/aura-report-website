"use client";

import { FormField } from "@/components/forms/FormField";
import PriceFormField from "@/components/forms/PriceFormField";
import SelectFormField from "@/components/forms/SelectFormField";
import SelectMultipleFormField from "@/components/forms/SelectMultipleFormField";
import { useInstitutionAndOutletsContext } from "@/components/providers/InstitutionsAndOutletsProvider";
import { LevelsApis } from "@/lib/hooks/levels-queries";
import { SubjectsApis } from "@/lib/hooks/subject-queries";
import { PRICE_FREQUENCIES } from "@/types/data/Course";
import { CreateCourseFormParams } from "./CreateCourseMultistepForm";
import { StudentsApis } from "@/lib/hooks/students-queries";
import { EducatorsApis } from "@/lib/hooks/educators-queries";
import { OutletRoomsApis } from "@/lib/hooks/outlet-rooms-queries";
import { useFormContext } from "react-hook-form";
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
  const { data: students = [] } = StudentsApis.useGetAllStudentsFromInstitution(
    currentInstitution?.id,
  );

  const { data: educators = [] } =
    EducatorsApis.useGetAllEducatorsFromInstitution(currentInstitution?.id);
  const { data: outletRooms = [] } =
    OutletRoomsApis.useGetAllOutletsRoomsOfOutlet(
      currentInstitution?.id,
      currentOutlet?.id,
    );

  const {
    register,
    formState: { errors },
  } = useFormContext<CreateCourseFormParams>();

  const unfocusedOutlets = currentOutlets.filter(
    (outlet) => outlet.id !== currentOutlet!.id,
  );
  const outletOptions = [currentOutlet!, ...unfocusedOutlets];
  return (
    <div className='flex flex-col max-h-[70vh] gap-4'>
      <div className='flex px-4 gap-4'>
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
          className='w-1/3'
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
          className='w-1/3'
          errorMessage={errors.outlet_id?.message}
        />
        <div className='w-1/3' />
      </div>
      <div className='flex px-4 gap-4'>
        <SelectFormField
          options={levels.map((lvl) => ({ display: lvl.name, value: lvl.id }))}
          {...register("level_id")}
          labelText='Level'
          type='text'
          className='w-1/3'
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
          className='w-1/3'
          errorMessage={errors.subject_ids?.message}
        />
        <FormField
          {...register("name")}
          labelText='Class Name (Optional)'
          placeholder={"i.e. Intensive Revision Package"}
          type='text'
          className='w-1/3'
          errorMessage={errors.name?.message}
        />
      </div>
      <div className='flex px-4 gap-4'>
        <FormField
          {...register("max_size", { valueAsNumber: true })}
          labelText='Max Class Size (Optional)'
          min={1}
          max={100}
          placeholder={"1"}
          type='number'
          className='w-1/3'
          errorMessage={errors.max_size?.message}
        />
        <PriceFormField
          labelText={"Price"}
          className='w-1/3'
          priceFormField={{
            type: "number",
            className: "w-1/6",
            ...register("price"),
          }}
          priceFrequencySelectFormField={{
            options: PRICE_FREQUENCIES.map((freq) => ({
              display: freq.split("_").join(" ").toLowerCase(),
              value: freq,
            })),
            type: "text",
            ...register("price_frequency"),
          }}
        />
        <div className='w-1/3' />
      </div>
      <div className='flex gap-4 px-4'>
        <SelectMultipleFormField
          formFieldName={""}
          options={students.map((student) => ({
            value: student.id,
            display: student.name,
          }))}
          {...register("student_ids")}
          labelText='Student(s)'
          type='text'
          className='w-1/3'
          errorMessage={errors.student_ids?.message}
        />
        <SelectMultipleFormField
          formFieldName={""}
          options={educators.map((edu) => ({
            value: edu.id,
            display: edu.name,
          }))}
          {...register("educator_ids")}
          labelText='Educator(s)'
          type='text'
          className='w-1/3'
          errorMessage={errors.educator_ids?.message}
        />
        <SelectFormField
          options={outletRooms.map((outletRoom) => ({
            value: outletRoom.id,
            display: outletRoom.name,
          }))}
          {...register("outlet_room_id")}
          labelText='Room(s)'
          type='text'
          className='w-1/3'
          errorMessage={errors.outlet_room_id?.message}
        />
      </div>
    </div>
  );
}
