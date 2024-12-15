import { PlusCircledIcon } from "@radix-ui/react-icons";

export type AddClassFormButtonType = {
  onClick?: () => void;
};

export function AddClassFormButton(props: AddClassFormButtonType) {
  return (
    <div
      onClick={props.onClick}
      className='flex gap-4 items-center justify-center p-2 ring-1 rounded-full ring-black'
    >
      <PlusCircledIcon className='size-8 text-orange-300' />
      <p>Add more classes</p>
    </div>
  );
}
