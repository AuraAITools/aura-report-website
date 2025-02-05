import { FormField } from "@/components/forms/FormField";
import SelectFormField from "@/components/forms/SelectFormField";
import { useInstitutionAndOutletsContext } from "@/components/providers/InstitutionsAndOutletsProvider";
import ProgressBar from "@/components/ui/progress-bar/ProgressBar";
import { SubmitFormButton } from "@/features/students-dashboard/create-client-account-form/SubmitFormButton";
import {
  useCreateInstitutionAdminAccount,
  useCreateOutletAdminAccount,
} from "@/lib/hooks/useAccounts";
import { BaseAccount, BaseAccountSchema } from "@/types/data/Account";
import { BaseOutlet } from "@/types/data/Outlet";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";

type FormCallbacks = {
  onSuccess?: (createdOutletAdmins: BaseAccount[]) => void;
  onFailure?: () => void;
  onError?: () => void;
};

const ACCOUNT_TYPE = ["INSTITUTION_ADMIN", "OUTLET_ADMIN"] as const;
type CreateAdminAccountsInOutletFormProps = {
  targetOutlet?: BaseOutlet;
} & FormCallbacks;

const formFieldsSchema = BaseAccountSchema.extend({
  outlet_id: z.string(),
  institution_id: z.string(),
  account_type: z.enum(ACCOUNT_TYPE),
}).omit({ relationship: true });

type FormFields = z.infer<typeof formFieldsSchema>;

export default function CreateAdminAccountsInOutletForm(
  props: CreateAdminAccountsInOutletFormProps,
) {
  const { currentInstitution, status, currentOutlets } =
    useInstitutionAndOutletsContext();

  if (status === "pending") {
    return <ProgressBar />;
  }
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormFields>({
    // TODO:
    // resolver: zodResolver(formFieldsSchema),
  });

  const {
    mutate: mutateInstitutionAdmin,
    isPending: institutionAdminIsPedning,
  } = useCreateInstitutionAdminAccount();

  const { mutate: mutateOutletAdmin, isPending: isPendingOutletAdmin } =
    useCreateOutletAdminAccount();

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

  // TODO: add the submit handler
  const onSubmit: SubmitHandler<FormFields> = (data) => {
    console.log(
      JSON.stringify({
        email: data.email,
        last_name: data.last_name,
        first_name: data.first_name,
        contact: data.contact,
        institution_id: data.institution_id,
      }),
      null,
      2,
    );
    if (data.account_type === "INSTITUTION_ADMIN") {
      mutateInstitutionAdmin(
        {
          email: data.email,
          last_name: data.last_name,
          first_name: data.first_name,
          contact: data.contact,
          institution_id: data.institution_id,
        },
        {
          onSuccess: () => {
            if (props.onSuccess) {
              props.onSuccess([
                {
                  id: "",
                  email: "",
                  first_name: "",
                  last_name: "",
                  contact: "",
                  relationship: "PARENT",
                },
              ]); //TODO
            }
            console.log(
              `successfully submitted ${JSON.stringify(data, null, 2)}`,
            );
          },
        },
      );
      return;
    }

    mutateOutletAdmin(
      {
        email: data.email,
        last_name: data.last_name,
        first_name: data.first_name,
        contact: data.contact,
        institution_id: data.institution_id,
        outlet_id: data.outlet_id,
      },
      {
        onSuccess: () => {
          if (props.onSuccess) {
            props.onSuccess([
              {
                id: "",
                email: "",
                first_name: "",
                last_name: "",
                contact: "",
                relationship: "PARENT",
              },
            ]); // TODO:
          }
          console.log(
            `successfully submitted ${JSON.stringify(data, null, 2)}`,
          );
        },
      },
    );
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
      <SelectFormField
        {...register("outlet_id")}
        options={outletOptions.map((oo) => ({
          value: oo.id,
          display: oo.name,
        }))}
        labelText='Outlet'
        errorMessage={errors.institution_id?.message}
        disabled
      />
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
      <SelectFormField
        {...register("account_type")}
        options={ACCOUNT_TYPE.map((e) => ({
          display: e.split("_").join(" ").toLowerCase(),
          value: e,
        }))}
        labelText='Institution'
        errorMessage={errors.institution_id?.message}
      />
      <SubmitFormButton className='col-span-2'>Submit</SubmitFormButton>
    </form>
  );
}
