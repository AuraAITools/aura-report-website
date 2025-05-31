import { FormField } from "@/components/forms/FormField";
import SelectFormField from "@/components/forms/SelectFormField";
import SelectMultipleFormField from "@/components/forms/SelectMultipleFormField";
import SubmitButton from "@/components/forms/SubmitButton";
import { useInstitutionAndOutletsContext } from "@/components/providers/InstitutionsAndOutletsProvider";
import { CoursesApis } from "@/lib/hooks/courses-queries";
import { EducatorsApis } from "@/lib/hooks/educators-queries";
import { LevelsApis } from "@/lib/hooks/levels-queries";
import { SubjectsApis } from "@/lib/hooks/subject-queries";
import { CreateAccountWithEducatorParams } from "@/lib/requests/educator";
import { CreateBaseAccountParamsSchema } from "@/types/data/Account";
import { EMPLOYMENT_TYPE } from "@/types/data/Educator";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";

const CreateEducatorAccountFormFieldsSchema =
  CreateBaseAccountParamsSchema.extend({
    date_of_birth: z.string().date(),
    start_date: z.string().date(),
    employment_type: z.enum(EMPLOYMENT_TYPE),
    level_ids: z.string().uuid().array(),
    subject_ids: z.string().uuid().array(),
    outlet_ids: z.string().uuid().array(),
    course_ids: z.string().uuid().array(),
  });

type CreateEducatorAccountFormFields = z.infer<
  typeof CreateEducatorAccountFormFieldsSchema
>;
type CreateEducatorFormProps = {
  onSuccess: () => void;
};
export default function CreateEducatorForm(props: CreateEducatorFormProps) {
  const { currentInstitution, currentOutlet } =
    useInstitutionAndOutletsContext();
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<CreateEducatorAccountFormFields>({
    defaultValues: {
      institution_id: currentInstitution?.id ?? "Loading...",
    },
  });
  const { mutate: createEducatorAccount } =
    EducatorsApis.useCreateEducatorAccountInInstitution();
  const { data: levels } = LevelsApis.useGetAllLevelsOfInstitution(
    currentInstitution?.id,
  );
  const { data: subjects } = SubjectsApis.useGetAllSubjectsOfInstitution(
    currentInstitution?.id,
  );
  const { data: courses } = CoursesApis.useGetAllCoursesFromOutlet(
    currentInstitution?.id,
    currentOutlet?.id,
  );

  const onSubmit: SubmitHandler<CreateEducatorAccountFormFields> = (params) => {
    console.log(JSON.stringify(params));

    const createAccountWithEducatorParams: CreateAccountWithEducatorParams = {
      ...params,
      educator: {
        name: `${params.first_name} ${params.last_name}`,
        email: params.email,
        date_of_birth: params.date_of_birth,
        start_date: params.start_date,
        employment_type: params.employment_type,
        level_ids: params.level_ids,
        subject_ids: params.subject_ids,
        outlet_ids: params.outlet_ids,
        courseIds: params.course_ids,
      },
    };
    createEducatorAccount(createAccountWithEducatorParams);
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
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
        className='w-1/2'
        errorMessage={errors.institution_id?.message}
      />
      <SelectMultipleFormField
        {...register("outlet_ids")}
        labelText={"outlets"}
        options={
          !!currentOutlet
            ? [{ value: currentOutlet.id, display: currentOutlet.name }]
            : []
        }
        formFieldName={""}
        errorMessage={errors.outlet_ids?.message}
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
      <SelectMultipleFormField
        {...register("course_ids")}
        labelText={"courses"}
        options={
          courses?.map((level) => ({
            value: level.id,
            display: level.name,
          })) ?? []
        }
        formFieldName={""}
        errorMessage={errors.level_ids?.message}
      />
      <SelectFormField
        control={control}
        name='employment_type'
        options={EMPLOYMENT_TYPE.map((type) => ({
          value: type,
          display: type.replaceAll("_", " ").toLowerCase(),
        }))}
        labelText='Employment Type'
        className='w-1/2'
        errorMessage={errors.employment_type?.message}
      />
      <FormField
        {...register("date_of_birth")}
        labelText='date of birth'
        type='date'
        className='w-1/2'
        errorMessage={errors.date_of_birth?.message}
      />
      <FormField
        {...register("start_date")}
        labelText='start date'
        type='date'
        className='w-1/2'
        errorMessage={errors.start_date?.message}
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
