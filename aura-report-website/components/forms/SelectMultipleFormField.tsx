import { generateKey } from "@/utils/id";
import * as Checkbox from "@radix-ui/react-checkbox";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import {
  CheckIcon,
  ChevronDownIcon,
  ExclamationTriangleIcon,
  MagnifyingGlassIcon,
} from "@radix-ui/react-icons";
import { Label, Popover, Select } from "radix-ui";
import React, {
  ComponentPropsWithRef,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";

export type SelectMultipleFormFieldProps = {
  labelText: string;
  options: { value: string; display: string }[];
  className?: string | undefined;
  errorMessage?: string;
  formFieldName: string;
  onChange?: (e: any) => void;
  value?: string[];
  defaultValue?: string[];
} & ComponentPropsWithRef<typeof Select.Root>;

export default function SelectMultipleFormField({
  labelText,
  options,
  className,
  errorMessage,
  onChange,
  value: controlledValue,
  defaultValue,
  formFieldName,
  name,
  ...restProps
}: SelectMultipleFormFieldProps) {
  // State to track selected options
  const [selectedValues, setSelectedValues] = useState<string[]>(
    defaultValue || [],
  );
  const [isOpen, setIsOpen] = useState(false);

  const [dropdownWidth, setDropdownWidth] = useState(0);
  const triggerRef = useRef<HTMLButtonElement>(null);

  // for search
  const [searchTerm, setSearchTerm] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);

  useLayoutEffect(() => {
    if (triggerRef.current) {
      setDropdownWidth(triggerRef.current.offsetWidth);
    }
  }, [isOpen]);
  // Focus the search input when dropdown opens
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      // Use a small timeout to ensure the dropdown is fully rendered
      const timer = setTimeout(() => {
        searchInputRef.current?.focus();
      }, 50);

      return () => clearTimeout(timer);
    } else {
      // Reset search when dropdown closes
      setSearchTerm("");
    }
  }, [isOpen]);

  // Use controlled component pattern if value is provided
  const value =
    controlledValue !== undefined ? controlledValue : selectedValues;

  // Update internal state when controlled value changes
  useEffect(() => {
    if (controlledValue !== undefined) {
      setSelectedValues(controlledValue);
    }
  }, [controlledValue]);

  const filteredOptions = options.filter((option) =>
    option.display.toLowerCase().includes(searchTerm.toLowerCase()),
  );
  // Handle checkbox changes
  const handleCheckboxChange = (
    optionValue: string,
    checked: Checkbox.CheckedState,
  ) => {
    let newValues: string[];

    if (checked === true) {
      // Add option if checked
      newValues = [...value, optionValue];
    } else {
      // Remove option if unchecked
      newValues = value.filter((val) => val !== optionValue);
    }

    // Update internal state for uncontrolled component
    if (controlledValue === undefined) {
      setSelectedValues(newValues);
    }

    // Call parent onChange handler with simulated event
    if (onChange) {
      const simulatedEvent = {
        target: {
          name: name || formFieldName,
          value: newValues,
        },
      };
      onChange(simulatedEvent);
    }
  };

  // Get display names of selected values for the button text
  const getSelectedDisplayText = () => {
    if (value.length === 0) return "Select options...";

    const selectedOptions = options.filter((opt) =>
      selectedValues.includes(opt.value),
    );
    return (
      <ul className='flex gap-2'>
        {selectedOptions.map((so, idx) => (
          <li
            className='flex min-w-[100px] justify-center items-center gap-2 bg-orange-400 text-white rounded-md py-1 px-2'
            key={generateKey("_li", so.value, idx.toString())}
          >
            <div>{so.display}</div>
          </li>
        ))}
      </ul>
    );
  };

  return (
    <>
      <Label.Root htmlFor={name} className='block font-semibold mb-1'>
        {labelText}
      </Label.Root>
      <Popover.Root>
        <Popover.Trigger asChild>
          <button
            ref={triggerRef}
            type='button'
            className={
              "w-full flex items-center justify-between py-2 px-4 text-gray-600 " +
              "border rounded border-gray-400 " +
              `${errorMessage ? "border-red-500 text-red-500" : ""} ` +
              `${isOpen ? "ring-2 ring-orange-300" : ""}`
            }
            aria-label={labelText}
          >
            <span className='truncate'>{getSelectedDisplayText()}</span>
            <ChevronDownIcon />
          </button>
        </Popover.Trigger>
        <Popover.Portal>
          <Popover.Content
            className='bg-white border rounded-lg shadow-md overflow-hidden'
            style={{ width: "var(--radix-popover-trigger-width)" }}
          >
            <div>
              {options.map((option, idx) => (
                <div
                  className={
                    "flex items-center text-gray-600 hover:bg-gray-100 hover:cursor-pointer " +
                    `${value.includes(option.value) ? "bg-gray-200" : ""}`
                  }
                >
                  <Checkbox.Root
                    key={generateKey(
                      "_dropdown_opt",
                      option.value,
                      idx.toString(),
                    )}
                    id={generateKey("checkbox", option.value, idx.toString())}
                    checked={value.includes(option.value)}
                    onCheckedChange={(checked) =>
                      handleCheckboxChange(option.value, checked)
                    }
                    className='ml-4 h-4 w-4 rounded border border-gray-300 flex items-center justify-center'
                  >
                    <Checkbox.Indicator>
                      <CheckIcon />
                    </Checkbox.Indicator>
                  </Checkbox.Root>
                  <label
                    htmlFor={generateKey(
                      "checkbox",
                      option.value,
                      idx.toString(),
                    )}
                    className='py-2 px-4 w-full hover:cursor-pointer'
                  >
                    {option.display}
                  </label>
                </div>
              ))}
            </div>
          </Popover.Content>
        </Popover.Portal>
      </Popover.Root>

      {/* Hidden select for form submission */}
      <select
        multiple
        name={formFieldName}
        style={{ display: "none" }}
        value={value}
        {...restProps}
      >
        {options.map((opt, idx) => (
          <option
            key={generateKey("_hidden_opt", opt.value, idx.toString())}
            value={opt.value}
          >
            {opt.display}
          </option>
        ))}
      </select>

      {/* Error message */}
      {errorMessage && (
        <div className='flex gap-4 px-2 items-center bg-red-500 p-1 rounded-b-md ring-1 text-white'>
          <ExclamationTriangleIcon />
          <span>{errorMessage}</span>
        </div>
      )}
    </>
    // <div className={`${className || ""}`}>
    //   <Label.Root htmlFor={name} className='block font-semibold mb-1'>
    //     {labelText}
    //   </Label.Root>
    //   <DropdownMenu.Root open={isOpen} onOpenChange={setIsOpen}>
    //     <DropdownMenu.Trigger asChild>
    //       <button
    //         ref={triggerRef}
    //         type='button'
    //         className={`flex justify-between items-center text-left w-full rounded p-3 text-[15px] shadow-[0_0_0_1px] outline-none bg-white
    //           ${errorMessage ? "border-red-500 text-red-500" : ""}
    //           ${isOpen ? "ring-2 ring-orange-300" : ""}
    //         `}
    //         aria-label={labelText}
    //       >
    //         <span className='truncate'>{getSelectedDisplayText()}</span>
    //         <ChevronDownIcon />
    //       </button>
    //     </DropdownMenu.Trigger>

    //     <DropdownMenu.Portal>
    //       <DropdownMenu.Content
    //         onCloseAutoFocus={(e) => {
    //           // Prevent auto-focus behavior when closing
    //           e.preventDefault();
    //         }}
    //         style={{ width: `${dropdownWidth}px` }}
    //         className='min-w-[220px] bg-white rounded-md p-1 shadow-lg border border-gray-200'
    //         sideOffset={5}
    //       >
    //         {/* Search input */}
    //         <div
    //           className='p-2 border-b border-gray-200'
    //           onMouseDown={(e) => e.stopPropagation()}
    //         >
    //           <div className='relative'>
    //             <div className='absolute inset-y-0 left-0 flex items-center pl-2'>
    //               <MagnifyingGlassIcon className='h-4 w-4 text-gray-400' />
    //             </div>
    //             <input
    //               ref={searchInputRef}
    //               type='text'
    //               className='w-full py-1 pl-8 pr-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-orange-300'
    //               placeholder='Search options...'
    //               value={searchTerm}
    //               onChange={(e) => setSearchTerm(e.target.value)}
    //               // Stop event propagation
    //               onClick={(e) => e.stopPropagation()}
    //               onMouseDown={(e) => e.stopPropagation()}
    //               onKeyDown={(e) => e.stopPropagation()}
    //               // This is important for maintaining focus
    //               autoFocus
    //             />
    //           </div>
    //         </div>

    //         <div className='max-h-[300px] overflow-y-auto'>
    //           {filteredOptions.length > 0 ? (
    //             filteredOptions.map((option, idx) => (
    //               <DropdownMenu.Item
    //                 key={generateKey(
    //                   "_dropdown_opt",
    //                   option.value,
    //                   idx.toString(),
    //                 )}
    //                 className='flex items-center px-2 py-2 text-[15px] outline-none hover:bg-gray-100 rounded'
    //                 onSelect={(e) => e.preventDefault()}
    //               >
    //                 <div className='flex items-center gap-2'>
    //                   <Checkbox.Root
    //                     id={generateKey(
    //                       "checkbox",
    //                       option.value,
    //                       idx.toString(),
    //                     )}
    //                     checked={value.includes(option.value)}
    //                     onCheckedChange={(checked) =>
    //                       handleCheckboxChange(option.value, checked)
    //                     }
    //                     className='h-4 w-4 rounded border border-gray-300 flex items-center justify-center'
    //                   >
    //                     <Checkbox.Indicator>
    //                       <CheckIcon />
    //                     </Checkbox.Indicator>
    //                   </Checkbox.Root>
    //                   <label
    //                     htmlFor={generateKey(
    //                       "checkbox",
    //                       option.value,
    //                       idx.toString(),
    //                     )}
    //                     className='cursor-pointer'
    //                   >
    //                     {option.display}
    //                   </label>
    //                 </div>
    //               </DropdownMenu.Item>
    //             ))
    //           ) : (
    //             <div className='px-2 py-3 text-center text-gray-500 text-sm'>
    //               No options match your search
    //             </div>
    //           )}
    //         </div>
    //       </DropdownMenu.Content>
    //     </DropdownMenu.Portal>
    //   </DropdownMenu.Root>
    // </div>
  );
}
