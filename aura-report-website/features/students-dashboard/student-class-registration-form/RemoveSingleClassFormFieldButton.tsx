import { Cross1Icon } from "@radix-ui/react-icons";

export type RemoveSingleClassFormFieldButtonProps = {
  onClick?: () => void;
  className?: string | undefined;
};
export function RemoveSingleClassFormFieldButton(
  props: RemoveSingleClassFormFieldButtonProps,
) {
  return (
    <Cross1Icon
      onClick={props.onClick}
      className={`inline-flex ${props.className ? props.className : ""}`}
    />
  );
}
