import MultiStepLayout from "@/components/ui/multi-step-layout/MultiStepLayout";
import { useMultiStepLayout } from "@/hooks/useMultiStepLayout";
import { BaseAccount } from "@/types/data/Account";
import { BaseOutlet } from "@/types/data/Outlet";
import { generateKey } from "@/utils/id";
import { useState } from "react";
import CreateAdminAccountsInOutletForm from "./CreateAdminAccountsInOutletForm";
import CreateOutletForm from "./CreateOutletForm";

export default function AddOutletsMultiStepForm() {
  const [stepIsCompleted, setFormIsCompleted] = useState<boolean[]>([
    false,
    false,
    false,
  ]);
  const [createdOutletAdmins, setCreatedOutletAdmins] = useState<
    BaseAccount[] | undefined
  >(undefined);

  const [createdOutlet, setCreatedOutlet] = useState<BaseOutlet | undefined>(
    undefined,
  );

  const { step, next, currentIndex, steps } = useMultiStepLayout([
    <CreateOutletForm onSuccess={onFirstFormSuccess} />,
    <CreateAdminAccountsInOutletForm
      targetOutlet={createdOutlet}
      onSuccess={onSecondFormSuccess}
    />,
    <AddOutletsFormCompletion
      createdOutlet={createdOutlet}
      createdOutletAdmins={createdOutletAdmins}
    />,
  ]);

  /**
   * on first form submit success, set form as complete and navigate to next step automatically
   */
  function onFirstFormSuccess(createdOutlet: BaseOutlet) {
    setCreatedOutlet(createdOutlet);
    setFormIsCompleted((prev) => {
      const newIsCompleted = [...prev];
      newIsCompleted[currentIndex] = true;
      return newIsCompleted;
    });
    next();
  }

  /**
   * on second form submit success, return successfully created admins
   */

  function onSecondFormSuccess(createdOutletAdmins: BaseAccount[]) {
    setCreatedOutletAdmins(createdOutletAdmins);
    setFormIsCompleted((prev) => {
      const newIsCompleted = [...prev];
      newIsCompleted[currentIndex] = true;
      return newIsCompleted;
    });
    next();
  }

  return (
    <div>
      <MultiStepLayout
        currentStep={currentIndex + 1}
        totalStep={steps.length}
        titles={["Outlet Location & Contact", "Add Admins", "Complete"]}
        completionStatuses={stepIsCompleted} // to maintain with state
      />
      {step}
    </div>
  );
}

type AddOutletsFormCompletionProps = {
  createdOutlet?: BaseOutlet;
  createdOutletAdmins?: BaseAccount[];
};
export function AddOutletsFormCompletion({
  createdOutlet,
  createdOutletAdmins,
}: AddOutletsFormCompletionProps) {
  return (
    <div>
      You have successfully created outlet{" "}
      <strong>{createdOutlet!.name}</strong>
      with the following admins
      {createdOutletAdmins!.length > 0 && (
        <ul>
          {createdOutletAdmins!.map((coa, idx) => (
            <li key={generateKey("outlet_admins", coa.id, idx.toString())}>
              {coa.email}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
