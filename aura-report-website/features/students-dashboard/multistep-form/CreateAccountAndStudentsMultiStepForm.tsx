import MultiStepLayout from "@/components/ui/multi-step-layout/MultiStepLayout";
import { useMultiStepLayout } from "@/hooks/useMultiStepLayout";

import { useInstitutionAndOutletsContext } from "@/components/providers/InstitutionsAndOutletsProvider";
import * as Dialog from "@radix-ui/react-dialog";
import { useState } from "react";
import { CloseDialogButton } from "../create-client-account-form/CloseDialogButton";
import { CreateBlankAccountForm } from "../create-client-account-form/CreateBlankAccountForm";
import { CreateMultipleStudentsForm } from "../create-student-form/CreateMultipleStudentsForm";

export default function CreateAccountAndStudentsMultiStepForm() {
  const [stepIsCompleted, setFormIsCompleted] = useState<boolean[]>([
    false,
    false,
    false,
  ]);

  const [createdAccountEmail, setCreatedAccountEmail] = useState<string>("");
  const [createdAccountId, setCreatedAccountID] = useState<string>("");

  const { currentOutlets } = useInstitutionAndOutletsContext();

  /**
   * on form submit success, set form as complete and navigate to next step automatically
   */
  function onFirstFormStepSuccess(accountEmail: string, accountId: string) {
    setCreatedAccountEmail(accountEmail);
    setCreatedAccountID(accountId);
    setFormIsCompleted((prev) => {
      const newIsCompleted = [...prev];
      newIsCompleted[currentIndex] = true;
      return newIsCompleted;
    });
    next();
  }

  /**
   * on form submit success, set form as complete and navigate to next step automatically
   */
  function onSecondFormStepSuccess() {
    setFormIsCompleted((prev) => {
      const newIsCompleted = [...prev];
      newIsCompleted[currentIndex] = true;
      return newIsCompleted;
    });
    next();
  }

  const { step, next, currentIndex, steps } = useMultiStepLayout([
    <CreateBlankAccountForm
      onSuccess={onFirstFormStepSuccess}
      disabled={stepIsCompleted[0]}
      outlets={currentOutlets}
    />,
    <CreateMultipleStudentsForm
      accountEmail={createdAccountEmail}
      accountId={createdAccountId}
      onSuccess={onSecondFormStepSuccess}
    />,

    <div className='relative flex flex-col justify-center items-center p-16'>
      <p>Completed!</p>
      <Dialog.Close className='absolute right-0 bottom-0' asChild>
        <button className='bg-orange-300 hover:bg-orange-400 text-white rounded-md p-2'>
          Close
        </button>
      </Dialog.Close>
    </div>,
  ]);

  return (
    <div>
      <CloseDialogButton />
      <MultiStepLayout
        currentStep={currentIndex + 1}
        totalStep={steps.length}
        titles={["Create Account", "Create Students", "Registration Complete"]}
        completionStatuses={stepIsCompleted} // to maintain with state
        title={"Add Student Account"}
      />
      {step}
    </div>
  );
}
