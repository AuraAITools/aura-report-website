import { FormField } from "@/components/forms/FormField";
import SelectFormField from "@/components/forms/SelectFormField";
import SubmitButton from "@/components/forms/SubmitButton";
import { useInstitutionAndOutletsContext } from "@/components/providers/InstitutionsAndOutletsProvider";
import { useCreateSubjectInInstitution } from "@/lib/hooks/subject-queries";
import {
  CreateSubjectParams,
  CreateSubjectParamsSchema,
} from "@/lib/requests/subjects";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
type CreateSubjectFormProps = {
  onSuccess: () => void;
};
export function CreateSubjectForm(props: CreateSubjectFormProps) {
  const { currentInstitution } = useInstitutionAndOutletsContext();
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateSubjectParams>({
    resolver: zodResolver(CreateSubjectParamsSchema),
  });
  const { mutate: createSubject, isPending } = useCreateSubjectInInstitution();

  const onSubmit: SubmitHandler<CreateSubjectParams> = async (params) => {
    console.log(JSON.stringify(params));
    createSubject(params, { onSuccess: props.onSuccess });
  };
  return (
    <form className='flex flex-col gap-2' onSubmit={handleSubmit(onSubmit)}>
      <SelectFormField
        control={control}
        name='institution_id'
        labelText='institution'
        disabled
        options={[
          {
            value: currentInstitution?.id ?? "loading",
            display: currentInstitution?.name ?? "loading",
          },
        ]}
        className='col-span-1 row-start-1 text-gray-300 pointer-events-none'
        errorMessage={errors.institution_id?.message}
      />
      <FormField
        {...register("name")}
        labelText='name'
        errorMessage={errors.name?.message}
      />
      <SubmitButton
        disabled={isPending}
        buttonTitle={"Create Subject"}
        isSubmitting={isPending}
        className='w-full'
      />
    </form>
  );
}
