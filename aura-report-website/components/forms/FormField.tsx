import { ChangeEvent } from "react";

export type FormFieldProps = {
  id: string;
  labelText: string;
  placeholder: string;
  type: "text" | "date" | "tel";
  disabled?: boolean;
  className?: string | undefined;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  value?: string;
};

export function FormField(props: FormFieldProps) {
  return (
    <div className={`${props.className ? props.className : ""}`}>
      <label
        className='w-[90px] text-right text-[15px] text-black'
        htmlFor={props.id}
      >
        {props.labelText}
      </label>
      <input
        disabled={props.disabled}
        className={`inline-flex h-[35px] w-full flex-1 items-center justify-center rounded px-2.5 text-[15px] leading-none text-violet11 shadow-[0_0_0_1px] shadow-violet7 outline-none `}
        id={props.id}
        placeholder={props.placeholder}
        type={props.type}
        onChange={props.onChange}
        value={props.value}
      />
    </div>
  );
}
