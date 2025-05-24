import { ExclamationTriangleIcon } from "@radix-ui/react-icons";

export type FormFieldProps = {
  labelText: string;
  className?: string | undefined;
  value?: string;
  errorMessage?: string;
} & React.InputHTMLAttributes<HTMLInputElement>;

export function FormField(props: FormFieldProps) {
  const { labelText, className, errorMessage, ...formProps } = props;

  return (
    <div className={`${className ? className : ""}`}>
      <label
        className={`w-[90px] text-right text-[15px] text-black ${errorMessage && "border-red-500 text-red-500"}`}
        htmlFor={formProps.id}
      >
        {labelText}
      </label>
      <input
        {...formProps}
        className={`inline-flex w-full flex-1 items-center justify-center rounded p-3 text-[15px] leading-none shadow-[0_0_0_1px] outline-none ${errorMessage && "border-red-500 text-red-500"}`}
      />
      {errorMessage && (
        <div className='flex gap-4 px-2 items-center bg-red-500 p-1 rounded-b-md ring-1 text-white'>
          <ExclamationTriangleIcon />
          <span>{errorMessage}</span>
        </div>
      )}
    </div>
  );
}
