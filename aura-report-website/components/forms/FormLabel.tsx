import { Label } from "radix-ui";

export type FormLabelProps = {
  label: string;
  htmlFor?: string;
  required?: boolean;
};
export default function FormLabel({
  label,
  htmlFor,
  required,
}: FormLabelProps) {
  return (
    <Label.Root
      htmlFor={htmlFor}
      className='block font-semibold mb-1 text-gray-600'
    >
      {label}
      {required && <span className='font-semibold text-red-500'>*</span>}
    </Label.Root>
  );
}
