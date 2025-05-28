import { ExclamationTriangleIcon } from "@radix-ui/react-icons";

export type FormFieldProps = {
  labelText: string;
  className?: string;
  value?: string;
  errorMessage?: string;
} & React.InputHTMLAttributes<HTMLInputElement>;

export function FormField(props: FormFieldProps) {
  const { labelText, className, errorMessage, ...formProps } = props;

  return (
    <div className={className}>
      <label htmlFor={formProps.name} className='block font-semibold mb-1'>
        {labelText}
      </label>
      <input
        {...formProps}
        className={
          "w-full flex items-center justify-between py-2 px-4 text-gray-600 " +
          "border rounded border-gray-400 " +
          "data-[placeholder]:text-gray-400 data-[disabled]:bg-gray-100 data-[disabled]:text-gray-400 " +
          `${errorMessage ? "border-red-500 text-red-500" : ""}`
        }
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
