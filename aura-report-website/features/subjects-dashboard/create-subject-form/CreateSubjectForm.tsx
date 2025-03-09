import { FormField } from "@/components/forms/FormField";
import SelectFormField from "@/components/forms/SelectFormField";
import { useInstitutionAndOutletsContext } from "@/components/providers/InstitutionsAndOutletsProvider";
import { SubmitFormButton } from "@/features/students-dashboard/create-client-account-form/SubmitFormButton";
import { useCreateSubjectInInstitution } from "@/lib/hooks/subject-queries";
import { CreateSubjectParams } from "@/lib/requests/subjects";
import { SubmitHandler, useForm } from "react-hook-form";

export function CreateSubjectForm() {
  const { currentInstitution } = useInstitutionAndOutletsContext();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateSubjectParams>();
  const { mutate, isPending } = useCreateSubjectInInstitution();

  const onSubmit: SubmitHandler<CreateSubjectParams> = async (params) => {
    console.log(JSON.stringify(params));
    mutate(params);
  };
  return (
    <form
      className='grid grid-cols-6 gap-6 py-4'
      onSubmit={handleSubmit(onSubmit)}
    >
      <SelectFormField
        {...register("institution_id")}
        labelText='institution'
        disabled
        options={[
          {
            value: currentInstitution?.id ?? "loading",
            display: currentInstitution?.name ?? "loading",
          },
        ]}
        className='col-span-2 row-start-1 text-gray-300 pointer-events-none'
        errorMessage={errors.name?.message}
      />
      <FormField
        {...register("name")}
        labelText='name'
        className='col-span-2 row-start-1 text-gray-300 pointer-events-none'
        errorMessage={errors.name?.message}
      />
      <SubmitFormButton className='col-span-2' loading={isPending}>
        Create
      </SubmitFormButton>
    </form>
  );
}
