import { generateKey } from "@/utils/id";
import * as Checkbox from "@radix-ui/react-checkbox";
import { CheckIcon, ExclamationTriangleIcon } from "@radix-ui/react-icons";
import React, { useEffect, useState } from "react";
export type HorizontalMultiSelectProps = {
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
export default function HorizontalMultiSelect(
  props: HorizontalMultiSelectProps,
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
  const [selectedValues, setSelectedValues] = useState(defaultValue || []);

  // Use controlled component pattern if value is provided
  const value =
    controlledValue !== undefined ? controlledValue : selectedValues;

  // Update internal state when controlled value changes - BUT ONLY WHEN IT COMES FROM PROPS
  useEffect(() => {
    if (controlledValue !== undefined) {
      setSelectedValues(controlledValue);
    }
  }, [controlledValue]);

  // Handle option selection
  const handleOptionToggle = (optionValue: string) => {
    let newValues;

    if (value.includes(optionValue)) {
      // Remove option if already selected
      newValues = value.filter((val) => val !== optionValue);
    } else {
      // Add option if not selected
      newValues = [...value, optionValue];
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

  // Key point: Stop propagation to prevent double-triggering
  const handleCheckboxChange = (
    checked: Checkbox.CheckedState,
    optionValue: string,
  ) => {
    // if (e) e.stopPropagation();
    handleOptionToggle(optionValue);
  };

  return (
    <div className={`${className || ""}`}>
      <label
        className='w-[90px] text-right text-[15px] text-black mb-2 block whitespace-nowrap'
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

      {/* Horizontal options list */}
      <div className='flex flex-wrap gap-3 items-center mt-1'>
        {options.map((option, idx) => {
          const isSelected = value.includes(option.value);

          return (
            <div
              key={generateKey("_option", option.value, idx.toString())}
              className={`
                flex items-center justify-center gap-2 py-2 px-3 
                rounded-md cursor-pointer transition-colors
                ${isSelected ? "border-[2px] border-black" : "border-[1px] border-gray-400"}
              `}
              onClick={() => handleOptionToggle(option.value)}
            >
              {option.display}
            </div>
          );
        })}
      </div>

      {/* Error message */}
      {errorMessage && (
        <div className='flex gap-4 mt-1 px-2 items-center bg-red-500 p-1 rounded-md ring-1 text-white'>
          <ExclamationTriangleIcon />
          <span>{errorMessage}</span>
        </div>
      )}
    </div>
  );
}
