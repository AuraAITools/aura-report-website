import { generateKey } from "@/utils/id";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { ChevronDownIcon } from "@radix-ui/react-icons";

type SimpleDropDownMenuOptions = {
  title: string;
  onClick: () => void;
};
type SimpleDropDownMenuProps = {
  focusedOption: SimpleDropDownMenuOptions;
  options: SimpleDropDownMenuOptions[];
};
export function SimpleDropdownMenu({
  focusedOption,
  options,
}: SimpleDropDownMenuProps) {
  const unfocusedOptions = options.filter(
    (o) => o.title !== focusedOption.title,
  );

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button
          className='inline-flex bg-slate-100 h-12 text-[13px] gap-2 justify-center items-center min-w-[220px] ring-1 ring-gray-300 text-black rounded-xl select-none'
          aria-label='dropdown options'
        >
          {focusedOption.title}
          {options.length > 1 && (
            <ChevronDownIcon className='size-6 justify-self-end ring-1 rounded-full ring-gray-300' />
          )}
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          className='min-w-[220px] bg-white rounded-md shadow-[0px_10px_38px_-10px_rgba(22,_23,_24,_0.35),_0px_10px_20px_-15px_rgba(22,_23,_24,_0.2)]'
          sideOffset={5}
        >
          {unfocusedOptions.map((o, idx) => {
            return (
              <DropdownMenu.Item
                key={generateKey("dropdown", o.title, idx.toString())}
                className='group relative flex h-[25px] select-none text-black hover:text-white hover:bg-orange-400 items-center rounded-[3px] pl-[25px] pr-[5px] text-[13px] leading-none outline-none data-[disabled]:pointer-events-none'
                onClick={o.onClick}
              >
                {o.title}
              </DropdownMenu.Item>
            );
          })}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
