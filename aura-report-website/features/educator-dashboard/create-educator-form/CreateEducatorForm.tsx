import { FormField } from "@/components/forms/FormField";
import SelectFormField from "@/components/forms/SelectFormField";
import SelectMultipleFormField from "@/components/forms/SelectMultipleFormField";
import SubmitButton from "@/components/forms/SubmitButton";
import { useInstitutionAndOutletsContext } from "@/components/providers/InstitutionsAndOutletsProvider";
import { EducatorsApis } from "@/lib/hooks/educators-queries";
import { LevelsApis } from "@/lib/hooks/levels-queries";
import { SubjectsApis } from "@/lib/hooks/subject-queries";
import { CreateEducatorParams } from "@/lib/requests/educator";
import { EMPLOYMENT_TYPE } from "@/types/data/Educator";
import { SubmitHandler, useForm } from "react-hook-form";

type CreateEducatorFormParams = CreateEducatorParams & {
  first_name: string;
  last_name: string;
  contact: string;
};

type CreateEducatorFormProps = {
  onSuccess: () => void;
};
export default function CreateEducatorForm(props: CreateEducatorFormProps) {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<CreateEducatorFormParams>({});
  const { currentInstitution, outlets } = useInstitutionAndOutletsContext();
  const { mutate: createEducatorAccount } =
    EducatorsApis.useCreateEducatorAccountInInstitution();
  const { mutate: createEducatorForAccountInOutlet } =
    EducatorsApis.useCreateEducatorForAccountInOutlet();
  const { data: levels } = LevelsApis.useGetAllLevelsOfInstitution(
    currentInstitution?.id,
  );
  const { data: subjects } = SubjectsApis.useGetAllSubjectsOfInstitution(
    currentInstitution?.id,
  );

  const onSubmit: SubmitHandler<CreateEducatorFormParams> = (params) => {
    console.log(JSON.stringify(params));
    params.name = `${params.first_name} ${params.last_name}`;
    createEducatorAccount(params, {
      onSuccess: (account_response) => {
        params.educator_account_id = account_response.data.id;
        createEducatorForAccountInOutlet(params, {
          onSuccess: props.onSuccess,
        });
      },
    });
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
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
        errorMessage={errors.institution_id?.message}
      />
      <SelectFormField
        {...register("outlet_id")}
        options={outlets.map((o) => ({
          value: o.id ?? "loading",
          display: o.name ?? "loading",
        }))}
        labelText='outlets'
        type='text'
        className='w-1/2'
        errorMessage={errors.outlet_id?.message}
      />
      <SelectMultipleFormField
        {...register("subject_ids")}
        labelText={"Subjects"}
        options={
          subjects?.map((sub) => ({
            value: sub.id,
            display: sub.name,
          })) ?? []
        }
        formFieldName={""}
        errorMessage={errors.subject_ids?.message}
      />
      <SelectMultipleFormField
        {...register("level_ids")}
        labelText={"Levels"}
        options={
          levels?.map((level) => ({
            value: level.id,
            display: level.name,
          })) ?? []
        }
        formFieldName={""}
        errorMessage={errors.level_ids?.message}
      />

      <SelectFormField
        {...register("employment_type")}
        options={EMPLOYMENT_TYPE.map((type) => ({
          value: type,
          display: type,
        }))}
        labelText='Employment Type'
        type='text'
        className='w-1/2'
        errorMessage={errors.employment_type?.message}
      />
      <FormField
        {...register("date_of_birth")}
        labelText='Date of Birth'
        type='date'
        className='w-1/2'
        errorMessage={errors.date_of_birth?.message}
      />
      <FormField
        {...register("first_name")}
        labelText='First Name'
        type='text'
        className='w-1/2'
        errorMessage={errors.first_name?.message}
      />
      <FormField
        {...register("last_name")}
        labelText='Last Name'
        type='text'
        className='w-1/2'
        errorMessage={errors.last_name?.message}
      />
      <FormField
        {...register("contact")}
        labelText='Contact'
        type='tel'
        className='w-1/2'
        errorMessage={errors.contact?.message}
      />
      <FormField
        {...register("email")}
        labelText='Email'
        type='email'
        className='w-1/2'
        errorMessage={errors.email?.message}
      />
      <SubmitButton
        disabled={isSubmitting}
        buttonTitle={"Enroll Educator"}
        isSubmitting={isSubmitting}
      />
    </form>
  );
}
