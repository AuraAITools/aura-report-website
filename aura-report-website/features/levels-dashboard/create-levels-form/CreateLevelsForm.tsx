import { FormField } from "@/components/forms/FormField";
import SelectFormField from "@/components/forms/SelectFormField";
import SelectMultipleFormField from "@/components/forms/SelectMultipleFormField";
import SubmitButton from "@/components/forms/SubmitButton";
import { useInstitutionAndOutletsContext } from "@/components/providers/InstitutionsAndOutletsProvider";
import { LevelsApis } from "@/lib/hooks/levels-queries";
import { SubjectsApis } from "@/lib/hooks/subject-queries";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
export const CreateLevelParamsSchema = z.object({
  institution_id: z.string().uuid({
    message: "A valid institution must be selected",
  }),
  name: z.string().min(1, {
    message: "Level name is required",
  }),
  subjects: z
    .array(
      z.string().uuid({
        message: "Invalid Subject selected",
      }),
    )
    .optional(),
});

export type CreateLevelParams = z.infer<typeof CreateLevelParamsSchema>;
type CreateLevelsFormProps = {
  onSuccess: () => void;
};
export default function CreateLevelsForm({ onSuccess }: CreateLevelsFormProps) {
  const { currentInstitution } = useInstitutionAndOutletsContext();
  const methods = useForm<CreateLevelParams>({
    resolver: zodResolver(CreateLevelParamsSchema),
  });

  const {
    control,
    formState: { errors },
  } = methods;
  const { mutate: createLevel, isPending } =
    LevelsApis.useCreateLevelOfInstitution();
  const { data: subjects = [] } = SubjectsApis.useGetAllSubjectsOfInstitution(
    currentInstitution?.id,
  );
  useEffect(() => {
    if (currentInstitution?.id) {
      methods.setValue("institution_id", currentInstitution.id);
    }
  }, [currentInstitution, methods.setValue]);

  const onSubmit: SubmitHandler<CreateLevelParams> = async (params) => {
    console.log(JSON.stringify(params));
    createLevel(params, { onSuccess: () => onSuccess() });
  };

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={methods.handleSubmit(onSubmit)}
        className='flex flex-col gap-4'
      >
        <SelectFormField
          control={control}
          name='institution_id'
          options={[
            {
              value: currentInstitution?.id ?? "loading",
              display: currentInstitution?.name ?? "loading",
            },
          ]}
          labelText='institution'
          disabled
          errorMessage={errors.institution_id?.message}
        />
        <FormField
          {...methods.register("name")}
          labelText='level name'
          placeholder={"i.e. Primary 6"}
          type='text'
          errorMessage={errors.name?.message}
        />
        <SelectMultipleFormField
          {...methods.register("subjects")}
          labelText={"subjects"}
          options={subjects.map((sub) => ({
            value: sub.id,
            display: sub.name,
          }))}
          formFieldName={""}
          errorMessage={errors.subjects?.message}
        />
        <SubmitButton
          disabled={isPending}
          buttonTitle={"Create Level"}
          isSubmitting={isPending}
          className='w-full'
        />
      </form>
    </FormProvider>
  );
}
