import useCreateAccount from "@/lib/hooks/useAccounts";
import { Account } from "@/types/data/Account";
import * as Dialog from "@radix-ui/react-dialog";
import { Cross2Icon } from "@radix-ui/react-icons";
import { useState } from "react";
import { z } from "zod";
import { FormField } from "../../../components/forms/FormField";
import { FormCallbacks } from "../create-student-form/CreateStudentsForm";
import { SubmitFormButton } from "./SubmitFormButton";

const formDetailsSchema = z.object({
  institution: z.string(),
  outlet: z.string(),
  email: z.string(),
  contact: z.string(),
  first_name: z.string(),
  last_name: z.string(),
});

type FormDetails = z.infer<typeof formDetailsSchema>;

type CreateClientAccountFormProps = {
  disabled: boolean;
} & FormCallbacks;

export function CreateClientAccountForm(props: CreateClientAccountFormProps) {
  const [institution, setInstitution] = useState<string>("");
  const [outlet, setOutlet] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [contact, setContact] = useState<string>("");
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");

  const { mutate, isPending } = useCreateAccount();

  function submitForm(e: React.FormEvent) {
    e.preventDefault();
    let account: Omit<Account, "id"> = {
      email: email,
      first_name: firstName,
      last_name: lastName,
      contact: contact,
    };
    mutate(account, {
      onSuccess: () => {
        if (props.onSuccess) props.onSuccess();
      },
    });
  }

  return (
    <div>
      <form className='grid grid-cols-2 gap-6 py-4' onSubmit={submitForm}>
        <FormField
          id={"institution"}
          labelText={"Institution"}
          placeholder={"Ministry of tuition"}
          type={"text"}
          onChange={(e) => setInstitution(e.target.value)}
          disabled
        />
        <FormField
          id={"outlet"}
          labelText={"Outlet"}
          placeholder={"Orchard Gateway"}
          type={"text"}
          onChange={(e) => setOutlet(e.target.value)}
          disabled
        />
        <FormField
          id={"email"}
          labelText={"Email Address of Parent/Student"}
          placeholder={"example@gmail.com"}
          type={"text"}
          onChange={(e) => setEmail(e.target.value)}
          disabled={props.disabled}
        />
        <FormField
          id={"contact"}
          labelText={"Contact Number of Parent/Student"}
          placeholder={"99999999"}
          type={"tel"}
          onChange={(e) => setContact(e.target.value)}
          disabled={props.disabled}
        />
        <FormField
          id={"first_name"}
          labelText={"First Name"}
          placeholder={"Hong Liang"}
          type={"text"}
          onChange={(e) => setFirstName(e.target.value)}
          disabled={props.disabled}
        />
        <FormField
          id={"last_name"}
          labelText={"Last Name"}
          placeholder={"Liu"}
          type={"text"}
          onChange={(e) => setLastName(e.target.value)}
          disabled={props.disabled}
        />

        <SubmitFormButton
          className='col-span-2'
          loading={isPending}
          disabled={props.disabled}
        >
          Create Account
        </SubmitFormButton>
      </form>
    </div>
  );
}

export function CloseDialogButton() {
  return (
    <Dialog.Close asChild>
      <button
        className='absolute right-2.5 top-2.5 inline-flex size-[25px] appearance-none items-center justify-center rounded-full text-black hover:bg-violet4 focus:shadow-[0_0_0_2px] focus:shadow-violet7 focus:outline-none'
        aria-label='Close'
      >
        <Cross2Icon />
      </button>
    </Dialog.Close>
  );
}
