import { FormField } from "@/components/forms/FormField";
import SelectFormField from "@/components/forms/SelectFormField";
import SubmitButton from "@/components/forms/SubmitButton";
import { useInstitutionAndOutletsContext } from "@/components/providers/InstitutionsAndOutletsProvider";
import { AccountsApis } from "@/lib/hooks/accounts-queries";
import {
  CreateInstitutionAdminParams,
  CreateInstitutionAdminParamsSchema,
} from "@/lib/requests/accounts";
import { BaseAccount, BaseAccountSchema } from "@/types/data/Account";
import { BaseOutlet } from "@/types/data/Outlet";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";

type FormCallbacks = {
  onSuccess?: (createdOutletAdmins: BaseAccount) => void;
  onFailure?: () => void;
  onError?: () => void;
};

type CreateAdminAccountsInOutletFormProps = {
  targetOutlet?: BaseOutlet;
} & FormCallbacks;

export default function CreateAdminAccountsInOutletForm(
  props: CreateAdminAccountsInOutletFormProps,
) {
  const { currentInstitution, currentOutlets } =
    useInstitutionAndOutletsContext();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CreateInstitutionAdminParams>({
    resolver: zodResolver(CreateInstitutionAdminParamsSchema),
  });

  const {
    mutate: mutateInstitutionAdmin,
    isPending: institutionAdminIsPending,
  } = AccountsApis.useCreateInstitutionAdminAccount();

  const { mutate: mutateOutletAdmin, isPending: isPendingOutletAdmin } =
    AccountsApis.useCreateOutletAdminAccount();

  let outletOptions;
  if (props.targetOutlet) {
    outletOptions = currentOutlets.filter(
      (o) => o.id !== props.targetOutlet?.id,
    );
    outletOptions.unshift({
      institution_id: currentInstitution ? currentInstitution.id : "",
      ...props.targetOutlet,
    });
  } else {
    outletOptions = currentOutlets;
  }

  const onSubmit: SubmitHandler<CreateInstitutionAdminParams> = (data) => {
    mutateInstitutionAdmin(data, {
      onSuccess: (data) => {
        if (props.onSuccess) {
          props.onSuccess({
            email: "",
            first_name: "",
            last_name: "",
            contact: "",
            id: "",
            pending_account_actions: [],
            personas: [],
          }); //TODO
        }
        console.log(`successfully submitted ${JSON.stringify(data, null, 2)}`);
      },
    });
    return;
  };

  return (
    <form
      className='grid grid-cols-2 gap-6 py-4'
      onSubmit={handleSubmit(onSubmit)}
    >
      <SelectFormField
        {...register("institution_id")}
        options={[
          {
            display: currentInstitution
              ? currentInstitution.name
              : "Loading...",
            value: currentInstitution ? currentInstitution.id : "",
          },
        ]}
        labelText='Institution'
        errorMessage={errors.institution_id?.message}
        disabled
      />
      {/* <SelectFormField
        {...register("outlet_id")}
        options={outletOptions.map((oo) => ({
          value: oo.id,
          display: oo.name,
        }))}
        labelText='Outlet'
        errorMessage={errors.institution_id?.message}
        disabled
      /> */}
      <FormField
        {...register("first_name")}
        labelText={"Admin First Name"}
        errorMessage={errors.first_name?.message}
      />
      <FormField
        {...register("last_name")}
        labelText={"Admin Last Name"}
        errorMessage={errors.last_name?.message}
      />
      <FormField
        {...register("email")}
        labelText={"Admin Email"}
        type='email'
        errorMessage={errors.email?.message}
      />
      <FormField
        {...register("contact")}
        labelText={"Contact Number"}
        type='tel'
        errorMessage={errors.contact?.message}
      />
      {/* <SelectFormField
        {...register("account_type")}
        options={ACCOUNT_TYPE.map((e) => ({
          display: e.split("_").join(" ").toLowerCase(),
          value: e,
        }))}
        labelText='Institution'
        errorMessage={errors.institution_id?.message}
      /> */}
      <SubmitButton
        disabled={institutionAdminIsPending}
        buttonTitle={"Create Account"}
        isSubmitting={institutionAdminIsPending}
        className='w-full'
      />
    </form>
  );
}
