import { generateKey } from "@/utils/id";
import * as Checkbox from "@radix-ui/react-checkbox";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { CheckIcon, ChevronDownIcon } from "@radix-ui/react-icons";
import React, { useEffect, useState } from "react";

export type SelectMultipleFormFieldProps = {
  labelText: string;
  options: { value: string; display: string }[];
  className?: string | undefined;
  errorMessage?: string;
  formFieldName: string;
  onChange?: (e: any) => void;
  value?: string[];
  defaultValue?: string[];
  name?: string;
} & Omit<
  React.InputHTMLAttributes<HTMLSelectElement>,
  "onChange" | "value" | "defaultValue"
>;

export default function SelectMultipleFormField(
  props: SelectMultipleFormFieldProps,
) {
  const {
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
  } = props;

  // State to track selected options
  const [selectedValues, setSelectedValues] = useState<string[]>(
    defaultValue || [],
  );
  const [isOpen, setIsOpen] = useState(false);

  // Use controlled component pattern if value is provided
  const value =
    controlledValue !== undefined ? controlledValue : selectedValues;

  // Update internal state when controlled value changes
  useEffect(() => {
    if (controlledValue !== undefined) {
      setSelectedValues(controlledValue);
    }
  }, [controlledValue]);

  // Handle checkbox changes
  const handleCheckboxChange = (
    optionValue: string,
    checked: boolean | "indeterminate",
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
            className='flex justify-center items-center gap-2 bg-orange-400 text-white rounded-md py-1 px-2'
            key={generateKey("_li", so.value, idx.toString())}
          >
            <div>{so.display}</div>
          </li>
        ))}
      </ul>
    );
  };

  return (
    <div className={`${className || ""}`}>
      <label
        className='w-[90px] text-right text-[15px] text-black'
        htmlFor={restProps.id}
      >
        {labelText}
      </label>

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

      {/* Dropdown Menu */}
      <DropdownMenu.Root open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenu.Trigger asChild>
          <button
            type='button'
            className={`flex justify-between items-center text-left w-full h-[35px] rounded px-2.5 text-[15px] shadow-[0_0_0_1px] outline-none bg-white
              ${errorMessage ? "border-red-500 text-red-500" : ""}
              ${isOpen ? "ring-2 ring-blue-500" : ""}
            `}
            aria-label={labelText}
          >
            <span className='truncate'>{getSelectedDisplayText()}</span>
            <ChevronDownIcon />
          </button>
        </DropdownMenu.Trigger>

        <DropdownMenu.Portal>
          <DropdownMenu.Content
            className='min-w-[220px] bg-white rounded-md p-1 shadow-lg border border-gray-200'
            sideOffset={5}
          >
            <div className='max-h-[300px] overflow-y-auto'>
              {options.map((option, idx) => (
                <DropdownMenu.Item
                  key={generateKey(
                    "_dropdown_opt",
                    option.value,
                    idx.toString(),
                  )}
                  className='flex items-center px-2 py-2 text-[15px] outline-none hover:bg-gray-100 rounded'
                  onSelect={(e) => e.preventDefault()} // Prevent auto-closing on select
                >
                  <div className='flex items-center gap-2'>
                    <Checkbox.Root
                      id={generateKey("checkbox", option.value, idx.toString())}
                      checked={value.includes(option.value)}
                      onCheckedChange={(checked) =>
                        handleCheckboxChange(option.value, checked)
                      }
                      className='h-4 w-4 rounded border border-gray-300 flex items-center justify-center'
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
                      className='cursor-pointer'
                    >
                      {option.display}
                    </label>
                  </div>
                </DropdownMenu.Item>
              ))}
            </div>
          </DropdownMenu.Content>
        </DropdownMenu.Portal>
      </DropdownMenu.Root>

      {/* Error message */}
      {errorMessage && (
        <div className='text-red-500 text-sm mt-1'>{errorMessage}</div>
      )}
    </div>
  );
}
