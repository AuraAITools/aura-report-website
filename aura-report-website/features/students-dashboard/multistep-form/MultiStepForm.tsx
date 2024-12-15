import MultiStepLayout from "@/components/ui/multi-step-layout/MultiStepLayout";
import { useMultiStepLayout } from "@/hooks/useMultiStepLayout";
import { useState } from "react";
import {
  CloseDialogButton,
  CreateClientAccountForm,
} from "../create-client-account-form/CreateClientAccountForm";
import { CreateStudentsForm } from "../create-student-form/CreateStudentsForm";

export default function MultiStepForm() {
  const [stepIsCompleted, setFormIsCompleted] = useState<boolean[]>([
    false,
    false,
    false,
  ]);

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
    />,
    <CreateStudentsForm />,

    <div className='flex justify-center items-center p-16'>Complete!</div>,
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
