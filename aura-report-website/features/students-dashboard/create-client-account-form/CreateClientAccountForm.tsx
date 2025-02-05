import SelectFormField from "@/components/forms/SelectFormField";
import useCreateAccount from "@/lib/hooks/useAccounts";
import { ACCOUNT_RELATIONSHIP } from "@/types/data/Account";
import { BaseOutlet } from "@/types/data/Outlet";
import { zodResolver } from "@hookform/resolvers/zod";

import { useInstitutionAndOutletsContext } from "@/components/providers/InstitutionsAndOutletsProvider";
import ProgressBar from "@/components/ui/progress-bar/ProgressBar";
import { BaseInstitution } from "@/types/data/Institution";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { FormField } from "../../../components/forms/FormField";
import { SubmitFormButton } from "./SubmitFormButton";

const formFieldsSchema = z.object({
  institution: z.string().nonempty({ message: "institution is required" }),
  outlet: z.string().nonempty({ message: "outlet is required" }),
  email: z.string().email(),
  contact: z
    .string()
    .min(8, {
      message: "contact must be a valid singapore phone number",
    })
    .max(8, {
      message: "contact must be a valid singapore phone number",
    }),
  first_name: z.string().nonempty({ message: "first name is required" }),
  last_name: z.string().nonempty({ message: "last name is required" }),
  relationship: z.enum(ACCOUNT_RELATIONSHIP),
});

type FormFields = z.infer<typeof formFieldsSchema>;
type FormCallbacks = {
  onSuccess?: () => void;
  onFailure?: () => void;
  onError?: () => void;
};
type CreateClientAccountFormProps = {
  disabled: boolean;
  institution: BaseInstitution;
  outlets: BaseOutlet[];
} & FormCallbacks;

export function CreateClientAccountForm(props: CreateClientAccountFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormFields>({
    resolver: zodResolver(formFieldsSchema),
  });
  const { mutate, isPending } = useCreateAccount();

  const { currentInstitution: institution, status: fetchInstitutionStatus } =
    useInstitutionAndOutletsContext();

  if (fetchInstitutionStatus === "pending") {
    return <ProgressBar />;
  }

  if (fetchInstitutionStatus === "error") {
    throw new Error("Failed to fetch institution of user");
  }

  const onSubmit: SubmitHandler<FormFields> = (data) => {
    let account = {
      ...data,
      institution_id: institution.id,
    };
    mutate(account, {
      onSuccess: () => {
        if (props.onSuccess) props.onSuccess();
      },
    });
  };

  return (
    <form
      className='grid grid-cols-2 gap-6 py-4'
      onSubmit={handleSubmit(onSubmit)}
    >
      <SelectFormField
        options={[{ display: institution?.name, value: institution?.id }]}
        labelText='Institution'
        errorMessage={errors.institution?.message}
        disabled
        {...register("institution")}
      />
      <SelectFormField
        options={props.outlets.map((o) => o.name)}
        labelText={"Outlet"}
        errorMessage={errors.outlet?.message}
        {...register("outlet")}
      />
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
        options={[...ACCOUNT_RELATIONSHIP]}
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
