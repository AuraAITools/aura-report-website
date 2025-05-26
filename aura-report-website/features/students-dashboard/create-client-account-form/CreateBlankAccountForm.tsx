import SelectFormField from "@/components/forms/SelectFormField";
import {
  CreateBaseAccountParams,
  CreateBaseAccountParamsSchema,
} from "@/types/data/Account";
import { BaseOutlet } from "@/types/data/Outlet";
import { zodResolver } from "@hookform/resolvers/zod";

import SubmitButton from "@/components/forms/SubmitButton";
import { useInstitutionAndOutletsContext } from "@/components/providers/InstitutionsAndOutletsProvider";
import { AccountsApis } from "@/lib/hooks/accounts-queries";
import { SubmitHandler, useForm } from "react-hook-form";
import { FormField } from "../../../components/forms/FormField";

type FormCallbacks = {
  onSuccess?: (accountEmail: string, accountId: string) => void;
  onFailure?: () => void;
  onError?: () => void;
};
type CreateBlankAccountFormProps = {
  disabled: boolean;
  outlets: BaseOutlet[];
} & FormCallbacks;

export function CreateBlankAccountForm(props: CreateBlankAccountFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateBaseAccountParams>({
    resolver: zodResolver(CreateBaseAccountParamsSchema),
  });
  const { mutate: createBlankAccount, isPending } =
    AccountsApis.useCreateBlankAccount(); // TODO: create a create client account hook

  const { currentInstitution: institution, outlets } =
    useInstitutionAndOutletsContext();

  const onSubmit: SubmitHandler<CreateBaseAccountParams> = (data) => {
    createBlankAccount(data, {
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
      <SubmitButton
        disabled={isPending}
        buttonTitle={"Create Account"}
        isSubmitting={isPending}
        className='w-full'
      />
    </form>
  );
}
