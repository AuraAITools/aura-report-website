import LoadingComponent from "@/components/ui/loading/LoadingComponent";
import MultiStepLayout from "@/components/ui/multi-step-layout/MultiStepLayout";
import { outlets } from "@/constants/outlets";
import { useMultiStepLayout } from "@/hooks/useMultiStepLayout";

import { useInstitutionAndOutletsContext } from "@/components/providers/InstitutionsAndOutletsProvider";
import * as Dialog from "@radix-ui/react-dialog";
import { useState } from "react";
import { CloseDialogButton } from "../create-client-account-form/CloseDialogButton";
import { CreateClientAccountForm } from "../create-client-account-form/CreateClientAccountForm";
import { CreateMultipleStudentsForm } from "../create-student-form/CreateMultipleStudentsForm";

export default function MultiStepForm() {
  const [stepIsCompleted, setFormIsCompleted] = useState<boolean[]>([
    false,
    false,
    false,
  ]);

  const { currentInstitution, status } = useInstitutionAndOutletsContext();

  if (status === "pending") {
    return (
      <LoadingComponent
        image={{
          src: "/Logo.png",
          alt: "Aura logo",
          className: "animate-spin-slow",
          width: 40,
          height: 40,
        }}
        loadingMessage={"Fetching Institution"}
      />
    );
  }

  if (status === "error") {
    throw new Error("institution not loaded");
  }
  /**
   * on form submit success, set form as complete and navigate to next step automatically
   */
  function onFormStepSuccess() {
    setFormIsCompleted((prev) => {
      const newIsCompleted = [...prev];
      newIsCompleted[currentIndex] = true;
      return newIsCompleted;
    });
    next();
  }
  const { step, next, currentIndex, steps } = useMultiStepLayout([
    <CreateClientAccountForm
      onSuccess={onFormStepSuccess}
      disabled={stepIsCompleted[0]}
      institution={currentInstitution}
      outlets={outlets}
    />,
    <CreateMultipleStudentsForm
      accountEmail={"kevinliusingapore@gmail.com"}
      onSuccess={onFormStepSuccess}
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
      />
      {step}
    </div>
  );
}
