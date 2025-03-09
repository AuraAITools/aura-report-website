import { generateKey } from "@/utils/id";

export type SelectFormFieldProps = {
  labelText: string;
  options: { value: string; display: string }[];
  className?: string | undefined;
  errorMessage?: string;
} & React.InputHTMLAttributes<HTMLSelectElement>;

export default function SelectFormField(props: SelectFormFieldProps) {
  const { labelText, options, className, errorMessage, ...selectProps } = props;

  return (
    <div className={`${className ? className : ""}`}>
      <label
        className='w-[90px] text-right text-[15px] text-black'
        htmlFor={selectProps.id}
      >
        {labelText}
      </label>
      <select
        {...selectProps}
        className={`text-center w-full h-[35px] rounded px-2.5 text-[15px] shadow-[0_0_0_1px] outline-none ${props.errorMessage && "border-red-500 text-red-500"}`}
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
  );
}
