import { FormField } from "@/components/forms/FormField";
import SelectFormField from "@/components/forms/SelectFormField";
import SelectMultipleFormField from "@/components/forms/SelectMultipleFormField";
import SubmitButton from "@/components/forms/SubmitButton";
import { useInstitutionAndOutletsContext } from "@/components/providers/InstitutionsAndOutletsProvider";
import { CoursesApis } from "@/lib/hooks/courses-queries";
import { LevelsApis } from "@/lib/hooks/levels-queries";
import { ExpandedOutlet, OutletsApis } from "@/lib/hooks/outlets-queries";
import { StudentsApis } from "@/lib/hooks/students-queries";
import { UpdateOutletParams } from "@/lib/requests/outlet";
import { UpdateStudentParams } from "@/lib/requests/students";
import { BaseOutlet } from "@/types/data/Outlet";
import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
type EditOutletFormProps = {
  outlet: ExpandedOutlet;
};
export default function EditOutletForm({ outlet }: EditOutletFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<UpdateOutletParams>();
  const { currentInstitution, outlets, currentOutlet } =
    useInstitutionAndOutletsContext();
  const { mutate: updateOutlet, isPending } =
    OutletsApis.useUpdateOutletInInstitution();
  const onSubmit: SubmitHandler<UpdateOutletParams> = (params) => {
    console.log(JSON.stringify(params));
    updateOutlet({ ...params, outlet_id: outlet.id });
  };

  return (
    <form
      className='grid grid-cols-6 gap-6 py-4'
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
        className='w-1/2'
      />
      <FormField
        labelText='Account Email'
        disabled
        value={outlet.email}
        className='col-span-2 row-start-1 text-gray-300 pointer-events-none'
      />
      <FormField
        {...register(`name`)}
        labelText={`name`}
        className='col-span-2 row-start-1'
        defaultValue={outlet.name}
      />
      <FormField
        {...register(`contact_number`)}
        labelText='Contact Number'
        type='text'
        className='col-span-2 row-start-2'
        defaultValue={outlet.contact_number}
      />

      <FormField
        {...register(`address`)}
        labelText={`address`}
        className='col-span-2 row-start-1'
        defaultValue={outlet.address}
      />
      <FormField
        {...register(`postal_code`)}
        labelText='Postal Code'
        defaultValue={outlet.postal_code}
        type='text'
        className='col-span-2 row-start-1'
      />
      <FormField
        {...register(`description`)}
        labelText='Description'
        type='text'
        className='col-span-2 row-start-2'
        defaultValue={outlet.description}
      />

      <SubmitButton
        disabled={isSubmitting || isPending}
        buttonTitle={"save"}
        isSubmitting={isSubmitting || isPending}
      />
    </form>
  );
}
