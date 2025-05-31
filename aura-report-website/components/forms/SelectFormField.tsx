import { generateKey } from "@/utils/id";
import {
  ChevronDownIcon,
  ChevronUpIcon,
  ExclamationTriangleIcon,
} from "@radix-ui/react-icons";
import { Select } from "radix-ui";
import { ComponentPropsWithRef } from "react";
import FormLabel from "./FormLabel";
import { Control, Controller, FieldValues, Path } from "react-hook-form";

export type SelectFormFieldProps<
  TFieldValues extends FieldValues,
  TName extends Path<TFieldValues>,
> = {
  labelText: string;
  options: { value: string; display: string }[];
  name: TName;
  control: Control<TFieldValues>;
  className?: string;
  errorMessage?: string;
} & ComponentPropsWithRef<typeof Select.Root>;

export default function SelectFormField<
  TFieldValues extends FieldValues,
  TName extends Path<TFieldValues>,
>({
  labelText,
  options,
  name,
  control,
  className,
  errorMessage,
  ...selectProps
}: SelectFormFieldProps<TFieldValues, TName>) {
  return (
    <div className={className}>
      <FormLabel
        htmlFor={name}
        label={labelText}
        required={selectProps.required}
      />
      <Controller
        control={control}
        name={name}
        render={({ field }) => (
          <Select.Root
            value={field.value}
            onValueChange={field.onChange}
            disabled={options.length === 0}
            {...selectProps}
          >
            <Select.Trigger
              className={
                "w-full flex items-center justify-between py-2 px-4 text-gray-600 " +
                "border rounded border-gray-400 " +
                "data-[state=open]:border-0 data-[state=open]:outline data-[state=open]:outline-2 data-[state=open]:outline-orange-400 " +
                "data-[placeholder]:text-gray-400 data-[disabled]:bg-gray-100 data-[disabled]:text-gray-400 " +
                `${errorMessage ? "border-red-500 text-red-500" : ""}`
              }
            >
              <Select.Value
                placeholder={options.length > 0 ? "Click to select" : "No data"}
              />
              <Select.Icon>
                <ChevronDownIcon />
              </Select.Icon>
            </Select.Trigger>
            <Select.Portal>
              <Select.Content
                position='popper'
                className='bg-white border rounded shadow-md overflow-hidden mt-1'
                style={{ width: "var(--radix-select-trigger-width)" }}
              >
                <Select.ScrollUpButton>
                  <ChevronUpIcon />
                </Select.ScrollUpButton>
                <Select.Viewport>
                  {options.map((opt, idx) => (
                    <Select.Item
                      key={generateKey("_opt", opt.value, idx.toString())}
                      value={opt.value}
                      className='py-2 px-4 text-gray-600 hover:bg-gray-100 hover:cursor-pointer data-[state=checked]:bg-gray-200'
                    >
                      <Select.ItemText> {opt.display}</Select.ItemText>
                    </Select.Item>
                  ))}
                </Select.Viewport>
                <Select.ScrollDownButton>
                  <ChevronDownIcon />
                </Select.ScrollDownButton>
              </Select.Content>
            </Select.Portal>
          </Select.Root>
        )}
      />
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
