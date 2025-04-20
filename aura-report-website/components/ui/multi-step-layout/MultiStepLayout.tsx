import { CheckIcon, ChevronRightIcon } from "@radix-ui/react-icons";
import React from "react";

type MultiStepLayoutProps = {
  title: string;
  currentStep: number;
  totalStep: number;
  titles: string[];
  completionStatuses: boolean[];
};
export default function MultiStepLayout(props: MultiStepLayoutProps) {
  return (
    <div className='flex p-4 mb-4 mx-4 items-center border-b-2'>
      <div className='text-3xl whitespace-nowrap'>{props.title}</div>
      <div className='w-1/12' />
      <div className='flex gap-4 items-center'>
        {props.titles.map((stepTitle, idx) => (
          <React.Fragment key={`multi_step_layout_${idx}`}>
            <div
              className={`${props.currentStep === idx + 1 ? "text-black" : "text-slate-400"}`}
            >
              {stepTitle}
            </div>
            {idx !== props.totalStep - 1 && <ChevronRightIcon />}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}

export type StepDisplayProps = {
  stepIndex: number;
  isCompleted: boolean;
  navigate?: (stepIndex: number) => void;
};
