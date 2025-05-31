import { generateKey } from "@/utils/id";
import { ExclamationTriangleIcon } from "@radix-ui/react-icons";
import React from "react";
export type PriceFormFieldProps = {
  labelText: string;
  errorMessage?: string;
  className?: string | undefined;
  priceFormField: {
    className?: string | undefined;
    value?: string;
  } & React.InputHTMLAttributes<HTMLInputElement>;
  priceFrequencySelectFormField: {
    options: { value: string; display: string }[];
    className?: string | undefined;
    value?: string;
  } & React.InputHTMLAttributes<HTMLSelectElement>;
};
export default function PriceFormField(props: PriceFormFieldProps) {
  const { labelText, className, errorMessage } = props;
  const { value, ...formProps } = props.priceFormField;
  const { options = [], ...selectProps } = props.priceFrequencySelectFormField;

  return (
    <div className={`flex flex-col ${className && className}`}>
      <label
        className={`flex w-[90px] text-right text-[15px] text-black ${errorMessage && "border-red-500 text-red-500"}`}
        htmlFor={formProps.id}
      >
        {labelText}
      </label>
      <div
        className={`flex border-[2px] ${errorMessage && "border-red-500 text-red-500"}`}
      >
        <input
          {...formProps}
          className={`inline-flex w-3/5 rounded-l items-center justify-center p-3 text-[15px] leading-none shadow-[0_0_0_1px] outline-none`}
        />
        <select
          {...selectProps}
          className={`text-center w-2/5 rounded-r p-3 text-[15px] shadow-[0_0_0_1px] outline-none`}
        >
          {options &&
            options.map((opt, idx) => (
              <option
                key={generateKey("_opt", opt.value, idx.toString())}
                value={opt.value}
              >
                {opt.display}
              </option>
            ))}
        </select>
      </div>
      {errorMessage && (
        <div className='flex gap-4 px-2 items-center bg-red-500 p-1 rounded-b-md ring-1 text-white'>
          <ExclamationTriangleIcon />
          <span>{errorMessage}</span>
        </div>
      )}
    </div>
  );
}
