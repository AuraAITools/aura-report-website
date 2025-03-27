import { FormField } from "@/components/forms/FormField";
import SelectFormField from "@/components/forms/SelectFormField";
import SubmitButton from "@/components/forms/SubmitButton";
import { useInstitutionAndOutletsContext } from "@/components/providers/InstitutionsAndOutletsProvider";
import { OutletsApis } from "@/lib/hooks/outlets-queries";
import { BaseOutlet, BaseOutletSchema } from "@/types/data/Outlet";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";

const formFieldSchema = BaseOutletSchema.extend({
  institution_id: z.string().uuid(),
});
type FormFields = z.infer<typeof formFieldSchema>;
type FormCallbacks = {
  onSuccess?: (createdForm: BaseOutlet) => void;
  onFailure?: () => void;
  onError?: () => void;
};

export default function CreateOutletForm(props: FormCallbacks) {
  const { currentInstitution } = useInstitutionAndOutletsContext();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormFields>({
    resolver: zodResolver(formFieldSchema),
  });
  const { mutate: createOutlet, isPending } =
    OutletsApis.useCreateOutletInInstitution();

  const onSubmit: SubmitHandler<FormFields> = (data) => {
    createOutlet(data, {
      onSuccess: (data) => {
        if (props.onSuccess) {
          props.onSuccess(data);
        }
        console.log(`successfully submitted ${JSON.stringify(data, null, 2)}`);
      },
    });
  };

  return (
    <form
      className='grid grid-cols-2 gap-6 py-4'
      onSubmit={handleSubmit(onSubmit)}
    >
      <SelectFormField
        {...register("institution_id")}
        options={
          currentInstitution
            ? [
                {
                  display: currentInstitution.name,
                  value: currentInstitution.id,
                },
              ]
            : []
        }
        labelText='Institution'
        errorMessage={errors.institution_id?.message}
        disabled
      />
      <FormField
        {...register("name")}
        labelText={"Outlet Name"}
        errorMessage={errors.name?.message}
      />
      <FormField
        {...register("address")}
        labelText={"Address"}
        errorMessage={errors.address?.message}
      />
      <FormField
        {...register("postal_code")}
        labelText={"Postal Code"}
        errorMessage={errors.postal_code?.message}
      />
      <FormField
        {...register("email")}
        labelText={"Outlet Email (Optional)"}
        type='email'
        errorMessage={errors.email?.message}
      />
      <FormField
        {...register("description")}
        labelText={"Description (Optional)"}
        errorMessage={errors.description?.message}
      />
      <FormField
        {...register("contact_number")}
        labelText={"Outlet Contact Number (Optional)"}
        type='tel'
        errorMessage={errors.contact_number?.message}
      />
      <SubmitButton
        disabled={isPending}
        buttonTitle={"Create Outlet"}
        isSubmitting={isPending}
        className='w-full'
      />
    </form>
  );
}
