import { Label } from "radix-ui";

export type FormLabelProps = {
  label: string;
  htmlFor?: string;
};
export default function FormLabel({ label, htmlFor }: FormLabelProps) {
  return (
    <Label.Root
      htmlFor={htmlFor}
      className='block font-semibold mb-1 text-gray-600'
    >
      {label}
    </Label.Root>
  );
}
