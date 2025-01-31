import * as Dialog from "@radix-ui/react-dialog";
import { Cross2Icon } from "@radix-ui/react-icons";
export function CloseDialogButton() {
  return (
    <Dialog.Close asChild>
      <button
        className='absolute right-2.5 top-2.5 inline-flex size-[25px] appearance-none items-center justify-center rounded-full text-black hover:bg-violet4 focus:shadow-[0_0_0_2px] focus:shadow-violet7 focus:outline-none'
        aria-label='Close'
      >
        <Cross2Icon />
      </button>
    </Dialog.Close>
  );
}
