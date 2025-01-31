import { generateKey } from "@/utils/id";

export type SelectFormFieldProps = {
  labelText: string;
  options: string[];
  className?: string | undefined;
  errorMessage?: string;
} & React.InputHTMLAttributes<HTMLSelectElement>;

export default function SelectFormField(props: SelectFormFieldProps) {
  return (
    <div className={`${props.className ? props.className : ""}`}>
      <label
        className='w-[90px] text-right text-[15px] text-black'
        htmlFor={props.id}
      >
        {props.labelText}
      </label>
      <select
        {...props}
        className={`text-center w-full h-[35px] rounded px-2.5 text-[15px] shadow-[0_0_0_1px] outline-none ${props.errorMessage && "border-red-500 text-red-500"}`}
      >
        {props.options &&
          props.options.map((opt, idx) => (
            <option key={generateKey("_opt", "", idx.toString())}>{opt}</option>
          ))}
      </select>
    </div>
  );
}
