import { generateKey } from "@/utils/id";
import * as Checkbox from "@radix-ui/react-checkbox";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import {
  CheckIcon,
  ChevronDownIcon,
  ExclamationTriangleIcon,
  MagnifyingGlassIcon,
  Cross1Icon,
} from "@radix-ui/react-icons";
import { Label, Popover, Select } from "radix-ui";
import React, {
  ComponentPropsWithRef,
  MouseEvent,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import FormLabel from "./FormLabel";

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

  const triggerRef = useRef<HTMLButtonElement>(null);

  // for search
  const [searchTerm, setSearchTerm] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);

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

  return (
    <div className={className}>
      <FormLabel htmlFor={name} label={labelText} />
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
            {value.length === 0 && (
              <span className='text-gray-400'>Select options...</span>
            )}
            {value.length > 0 && (
              <span className='truncate'>
                <DisplayTokens
                  selectedOptions={options.filter((opt) =>
                    selectedValues.includes(opt.value),
                  )}
                  onTokenRemove={(optionValue) =>
                    handleCheckboxChange(optionValue, false)
                  }
                />
              </span>
            )}
            <ChevronDownIcon />
          </button>
        </Popover.Trigger>
        <Popover.Portal>
          <Popover.Content
            className='bg-white border rounded-lg shadow-md overflow-hidden'
            style={{ width: "var(--radix-popover-trigger-width)" }}
          >
            {/* Search input */}
            <div
              className='p-2 border-b border-gray-200'
              onMouseDown={(e) => e.stopPropagation()}
            >
              <div className='relative'>
                <div className='absolute inset-y-0 left-0 flex items-center pl-2'>
                  <MagnifyingGlassIcon className='h-4 w-4 text-gray-400' />
                </div>
                <input
                  ref={searchInputRef}
                  type='text'
                  className='w-full py-1 pl-8 pr-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-orange-300'
                  placeholder='Search options...'
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  // Stop event propagation
                  onClick={(e) => e.stopPropagation()}
                  onMouseDown={(e) => e.stopPropagation()}
                  onKeyDown={(e) => e.stopPropagation()}
                  // This is important for maintaining focus
                  autoFocus
                />
              </div>
            </div>

            {/* Options list */}
            <div>
              {filteredOptions.length === 0 && (
                <div className='ml-2 px-2 py-3 text-gray-400'>
                  No options match your search
                </div>
              )}
              {filteredOptions.length > 0 &&
                filteredOptions.map((option, idx) => (
                  <div
                    key={generateKey(
                      "_dropdown_opt",
                      option.value,
                      idx.toString(),
                    )}
                    className={
                      "flex items-center text-gray-600 hover:bg-gray-100 hover:cursor-pointer " +
                      `${value.includes(option.value) ? "bg-gray-200" : ""}`
                    }
                  >
                    <Checkbox.Root
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
    </div>
  );
}

const DisplayTokens = ({
  selectedOptions,
  onTokenRemove,
}: {
  selectedOptions: SelectMultipleFormFieldProps["options"];
  onTokenRemove: (optionValue: string) => void;
}) => {
  const handleRemoveClick = (
    e: MouseEvent<SVGElement>,
    optionValue: string,
  ) => {
    e.stopPropagation();
    onTokenRemove(optionValue);
  };

  return (
    <ul className='flex gap-2'>
      {selectedOptions.map((option, idx) => (
        <li
          key={generateKey("_li", option.value, idx.toString())}
          className={
            "flex min-w-[100px] justify-center items-center gap-2 border border-orange-400 rounded-md py-1 px-2 " +
            "hover:bg-orange-100"
          }
        >
          <span>{option.display}</span>
          <Cross1Icon onClick={(e) => handleRemoveClick(e, option.value)} />
        </li>
      ))}
    </ul>
  );
};
