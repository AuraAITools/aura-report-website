import { FormField } from "@/components/forms/FormField";
import SelectFormField from "@/components/forms/SelectFormField";
import SelectMultipleFormField from "@/components/forms/SelectMultipleFormField";
import SubmitButton from "@/components/forms/SubmitButton";
import { useInstitutionAndOutletsContext } from "@/components/providers/InstitutionsAndOutletsProvider";
import { LevelsApis } from "@/lib/hooks/levels-queries";
import { SubjectsApis } from "@/lib/hooks/subject-queries";
import { ExpandedLevel, UpdateLevelParams } from "@/lib/requests/levels";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
type EditLevelFormProps = {
  level: ExpandedLevel;
};
export default function EditLevelForm({ level }: EditLevelFormProps) {
  const { currentInstitution } = useInstitutionAndOutletsContext();
  const methods = useForm<UpdateLevelParams>({
    // resolver: zodResolver(formFieldSchema), //include validation in future
  });
  const { mutate: updateLevel, isPending } =
    LevelsApis.useUpdateLevelInInstitution();
  const { data: subjects = [] } = SubjectsApis.useGetAllSubjectsOfInstitution(
    currentInstitution?.id,
  );

  const onSubmit: SubmitHandler<UpdateLevelParams> = async (params) => {
    console.log(JSON.stringify(params));
    updateLevel({
      ...params,
      level_id: level.id,
    });
  };

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={methods.handleSubmit(onSubmit)}
        className='flex flex-col gap-4'
      >
        <SelectFormField
          control={methods.control}
          name='institution_id'
          options={[
            {
              value: currentInstitution?.id ?? "loading",
              display: currentInstitution?.name ?? "loading",
            },
          ]}
          labelText='institution'
          disabled
          className='w-1/2'
        />
        <FormField
          {...methods.register("name")}
          labelText='level name'
          placeholder={"i.e. Primary 6"}
          type='text'
          defaultValue={level.name}
          className='w-1/2'
        />
        <SelectMultipleFormField
          {...methods.register("subject_ids")}
          labelText={"subjects"}
          options={subjects.map((lvl) => ({
            display: lvl.name,
            value: lvl.id,
          }))}
          formFieldName={""}
        />
        <SubmitButton
          disabled={isPending}
          buttonTitle={"save"}
          isSubmitting={isPending}
        />
      </form>
    </FormProvider>
  );
}
