import * as Checkbox from "@radix-ui/react-checkbox";
import { CheckIcon } from "@radix-ui/react-icons";

type CheckBoxProps = {
  checked: boolean;
};
export function CheckBox({ checked }: CheckBoxProps) {
  return (
    <Checkbox.Root
      className='group flex size-[25px] appearance-none items-center justify-center rounded bg-white shadow-[0_2px_10px] shadow-orange-300 outline-none hover:bg-orange-300'
      defaultChecked={checked}
    >
      <Checkbox.CheckboxIndicator className='group text-black group-hover:text-white'>
        <CheckIcon />
      </Checkbox.CheckboxIndicator>
    </Checkbox.Root>
  );
}
