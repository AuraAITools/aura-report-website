import SelectFormField from "@/components/forms/SelectFormField";
import { ACCOUNT_RELATIONSHIP, BaseAccountSchema } from "@/types/data/Account";
import { BaseOutlet } from "@/types/data/Outlet";
import { zodResolver } from "@hookform/resolvers/zod";

import { useInstitutionAndOutletsContext } from "@/components/providers/InstitutionsAndOutletsProvider";
import { AccountsApis } from "@/lib/hooks/accounts-queries";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { FormField } from "../../../components/forms/FormField";
import { SubmitFormButton } from "./SubmitFormButton";

const formFieldsSchema = BaseAccountSchema.omit({
  id: true,
}).extend({
  institution_id: z.string(),
});

type FormFields = z.infer<typeof formFieldsSchema>;

type FormCallbacks = {
  onSuccess?: (accountEmail: string, accountId: string) => void;
  onFailure?: () => void;
  onError?: () => void;
};
type CreateClientAccountFormProps = {
  disabled: boolean;
  outlets: BaseOutlet[];
} & FormCallbacks;

export function CreateClientAccountForm(props: CreateClientAccountFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormFields>({
    resolver: zodResolver(formFieldsSchema),
  });
  const { mutate, isPending } = AccountsApis.useCreateStudentClientAccount(); // TODO: create a create client account hook

  const { currentInstitution: institution, outlets } =
    useInstitutionAndOutletsContext();

  const onSubmit: SubmitHandler<FormFields> = (data) => {
    mutate(data, {
      // TODO: fix
      onSuccess: (createdAccount) => {
        if (props.onSuccess)
          props.onSuccess(createdAccount.email, createdAccount.id);
      },
    });
  };

  return (
    <form
      className='grid grid-cols-2 gap-6 py-4'
      onSubmit={handleSubmit(onSubmit)}
    >
      <SelectFormField
        options={[
          {
            display: institution?.name ?? "loading",
            value: institution?.id ?? "",
          },
        ]}
        labelText='Institution'
        errorMessage={errors.institution_id?.message}
        disabled
        {...register("institution_id")}
      />
      {/* <SelectFormField
        options={outlets.map((o) => ({ value: o.id, display: o.name }))}
        labelText={"Outlet"}
        errorMessage={errors.outlets?.message}
        {...register("outlet")}
      /> */}
      <FormField
        labelText={"Email Address of Parent/Student"}
        {...register("email")}
        errorMessage={errors.email?.message}
      />
      <FormField
        labelText={"Contact Number of Parent/Student"}
        {...register("contact")}
        type='tel'
        errorMessage={errors.contact?.message}
      />
      <FormField
        labelText={"First Name"}
        errorMessage={errors.first_name?.message}
        {...register("first_name")}
      />
      <FormField
        labelText={"Last Name"}
        errorMessage={errors.last_name?.message}
        {...register("last_name")}
      />
      <SelectFormField
        options={ACCOUNT_RELATIONSHIP.map((relationship) => ({
          value: relationship,
          display: relationship.toLocaleLowerCase(),
        }))}
        labelText='Relationship'
        errorMessage={errors.relationship?.message}
        {...register("relationship")}
      />
      <SubmitFormButton
        className='col-span-2'
        loading={isPending}
        disabled={props.disabled}
      >
        Create Account
      </SubmitFormButton>
    </form>
  );
}
