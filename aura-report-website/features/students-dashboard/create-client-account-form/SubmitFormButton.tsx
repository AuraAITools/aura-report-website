import { SunIcon } from "@radix-ui/react-icons";
import { PropsWithChildren } from "react";

export type SubmitFormButtonProps = {
  className?: string | undefined;
  loading?: boolean;
  disabled?: boolean;
} & PropsWithChildren;
export function SubmitFormButton(props: SubmitFormButtonProps) {
  let display;

  if (props.disabled) {
    display = <div>Account Created</div>;
  } else if (props.loading) {
    display = <Spinner />;
  } else {
    display = props.children;
  }

  return (
    <button
      type='submit'
      className={`inline-flex h-[35px] p-4 items-center justify-center rounded bg-green4 px-[15px] font-medium leading-none text-white hover:bg-orange-400 ${props.className ? props.className : ""} ${props.loading ? "bg-green-600 pointer-events-none" : "bg-orange-300"} ${props.disabled && "bg-slate-300 pointer-events-none"}`}
      disabled={props.disabled}
    >
      {display}
    </button>
  );
}

function Spinner() {
  return (
    <div className='flex gap-4 items-center justify-center'>
      <SunIcon className='animate-spin-slow size-6' />
      <div>Creating Account ... </div>
    </div>
  );
}
