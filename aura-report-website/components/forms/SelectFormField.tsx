import { generateKey } from "@/utils/id";

export type SelectFormFieldProps = {
  id: string;
  labelText: string;
  placeholder: string;
  type: "select";
  options: string[];
  multiple?: boolean;
  disabled?: boolean;
  onChange?: () => void;
  className?: string | undefined;
};

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
        className={`text-center w-full h-[35px] rounded px-2.5 text-[15px] shadow-[0_0_0_1px] outline-none`}
        id={props.id}
        multiple={props.multiple}
        disabled={props.disabled}
        onChange={props.onChange}
      >
        {props.options &&
          props.options.map((opt, idx) => (
            <option key={generateKey("_opt", props.id, opt)}>{opt}</option>
          ))}
      </select>
    </div>
  );
}
