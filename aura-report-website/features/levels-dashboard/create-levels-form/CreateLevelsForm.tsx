import { FormField } from "@/components/forms/FormField";
import SelectFormField from "@/components/forms/SelectFormField";
import SelectMultipleFormField from "@/components/forms/SelectMultipleFormField";
import { useInstitutionAndOutletsContext } from "@/components/providers/InstitutionsAndOutletsProvider";
import { LevelsApis } from "@/lib/hooks/levels-queries";
import { SubjectsApis } from "@/lib/hooks/subject-queries";
import { useEffect } from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
export const CreateLevelParamsSchema = z.object({
  institution_id: z.string().uuid(),
  name: z.string().min(1),
  subjects: z.array(z.string().uuid()).optional(),
});

export type CreateLevelParams = z.infer<typeof CreateLevelParamsSchema>;
type CreateLevelsFormProps = {
  onSuccess: () => void;
};
export default function CreateLevelsForm({ onSuccess }: CreateLevelsFormProps) {
  const { currentInstitution } = useInstitutionAndOutletsContext();
  const methods = useForm<CreateLevelParams>({
    // resolver: zodResolver(formFieldSchema), //include validation in future
  });
  const { mutate } = LevelsApis.useCreateLevelOfInstitution();
  const { data: subjects } = SubjectsApis.useGetAllSubjectsOfInstitution(
    currentInstitution?.id,
  );
  useEffect(() => {
    if (currentInstitution?.id) {
      methods.setValue("institution_id", currentInstitution.id);
    }
  }, [currentInstitution, methods.setValue]);

  const onSubmit: SubmitHandler<CreateLevelParams> = async (params) => {
    console.log(JSON.stringify(params));
    mutate(params, { onSuccess: () => onSuccess() });
  };

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={methods.handleSubmit(onSubmit)}
        className='flex flex-col gap-4'
      >
        <SelectFormField
          {...methods.register("institution_id")}
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
          {...methods.register("name")}
          labelText='level name'
          placeholder={"i.e. Primary 6"}
          type='text'
          className='w-1/2'
        />
        <SelectMultipleFormField
          {...methods.register("subjects")}
          labelText={"subjects"}
          options={
            subjects?.map((sub) => ({
              value: sub.id,
              display: sub.name,
            })) ?? []
          }
          formFieldName={""}
        />
        <button
          type='submit'
          className='w-1/4 bg-black text-white p-4 rounded-md'
          disabled={methods.formState.isSubmitting}
        >
          Create Level
        </button>
      </form>
    </FormProvider>
  );
}
