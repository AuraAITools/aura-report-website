import { CheckIcon } from "@radix-ui/react-icons";
import React from "react";

type MultiStepLayoutProps = {
  currentStep: number;
  totalStep: number;
  titles: string[];
  completionStatuses: boolean[];
};
export default function MultiStepLayout(props: MultiStepLayoutProps) {
  return (
    <div className='py-2'>
      <div className='flex w-full justify-between items-center'>
        {props.completionStatuses.map((completionStatus, idx) => {
          return (
            <React.Fragment key={`multi_step_layout_${idx}`}>
              <StepDisplay stepIndex={idx + 1} isCompleted={completionStatus} />
              {idx !== props.titles.length - 1 && (
                <ConnectedEdge isCompleted={completionStatus} />
              )}
            </React.Fragment>
          );
        })}
      </div>
      <TitleBar
        titles={props.titles}
        completionStatus={props.completionStatuses}
      />
    </div>
  );
}

export type TitleBarProps = {
  titles: string[];
  completionStatus: boolean[];
};
export function TitleBar(props: TitleBarProps) {
  return (
    <div className='flex justify-between items-center'>
      {props.titles.map((title, idx) => {
        return (
          <div
            key={`title_step_bar_${idx}`}
            className={`${props.completionStatus[idx] ? "text-green-500" : "text-slate-500"}`}
          >
            {title}
          </div>
        );
      })}
    </div>
  );
}
export type StepDisplayProps = {
  stepIndex: number;
  isCompleted: boolean;
  navigate?: (stepIndex: number) => void;
};

export function StepDisplay(props: StepDisplayProps) {
  function onClick() {
    if (props.navigate) props.navigate(props.stepIndex - 1);
  }
  return (
    <div onClick={onClick}>
      <div
        className={`flex rounded-full w-12 h-12 opacity-50 justify-center items-center m-2 ${props.isCompleted ? "bg-green-500" : "bg-slate-300"}`}
      >
        {props.isCompleted ? (
          <CheckIcon className='size-6 text-white' />
        ) : (
          props.stepIndex
        )}
      </div>
    </div>
  );
}
type ConnectedEdgeProps = {
  isCompleted: boolean;
};
export function ConnectedEdge(props: ConnectedEdgeProps) {
  return (
    <div
      className={`h-[2px] w-full ${props.isCompleted ? "bg-green-500" : "bg-slate-300"}`}
    />
  );
}
