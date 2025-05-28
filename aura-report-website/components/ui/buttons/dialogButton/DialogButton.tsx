import { CloseDialogButton } from "@/features/students-dashboard/create-client-account-form/CloseDialogButton";
import { useToggle } from "@/hooks/useToggle";
import * as Dialog from "@radix-ui/react-dialog";
import { ReactNode } from "react";

export type DialogButtonProps = {
  dialogFn: (onSuccess: () => void) => ReactNode;
  buttonTitle: string;
  dialogTitle: string;
};
export default function DialogButton({
  dialogFn,
  buttonTitle,
  dialogTitle,
}: DialogButtonProps) {
  const { on: open, setOn: setOpen } = useToggle(false);
  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger
        className={`flex justify-center items-center min-w-[100px] min-h-[50px] px-2 bg-black text-white rounded-lg hover:text-slate-200`}
      >
        <button className='inline-flex justify-center items-center'>
          {buttonTitle}
        </button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className='fixed inset-0 bg-gray-300 opacity-50' />
        <Dialog.Content className='fixed flex flex-col left-1/2 top-1/2 max-h-[85vh] w-[90vw] -translate-x-1/2 -translate-y-1/2 rounded-md bg-white p-[25px] shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none overflow-auto'>
          <Dialog.Title className='text-2xl border-b-2 mb-4 pb-4'>
            {dialogTitle}
          </Dialog.Title>
          <CloseDialogButton />
          {dialogFn(() => setOpen(false))}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
