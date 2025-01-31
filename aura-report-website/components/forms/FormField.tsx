import { ExclamationTriangleIcon } from "@radix-ui/react-icons";

export type FormFieldProps = {
  labelText: string;
  className?: string | undefined;
  value?: string;
  errorMessage?: string;
} & React.InputHTMLAttributes<HTMLInputElement>;

export function FormField(props: FormFieldProps) {
  return (
    <div className={`${props.className ? props.className : ""}`}>
      <label
        className={`w-[90px] text-right text-[15px] text-black ${props.errorMessage && "border-red-500 text-red-500"}`}
        htmlFor={props.id}
      >
        {props.labelText}
      </label>
      <input
        {...props}
        className={`inline-flex h-[35px] w-full flex-1 items-center justify-center rounded px-2.5 text-[15px] leading-none shadow-[0_0_0_1px] outline-none ${props.errorMessage && "border-red-500 text-red-500"}`}
      />
      {props.errorMessage && (
        <div className='flex gap-4 px-2 items-center bg-red-500 p-1 rounded-md text-white'>
          <ExclamationTriangleIcon />
          <span>{props.errorMessage}</span>
        </div>
      )}
    </div>
  );
}
