import { CloseDialogButton } from "@/features/students-dashboard/create-client-account-form/CloseDialogButton";
import { AnimatedDialogOverlay } from "@/features/students-dashboard/multistep-form/MultiStepFormDialog";
import * as Dialog from "@radix-ui/react-dialog";
import { PlusCircledIcon } from "@radix-ui/react-icons";
import AddOutletsMultiStepForm from "./AddOutletsMultiStepForm";

export default function CreateOutletsMultiStepFormDialog() {
  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <button className='group inline-flex h-[30px] gap-2 items-center rounded bg-orange-300 px-[15px] font-medium hover:bg-orange-400'>
          <PlusCircledIcon className='size-6 text-white group-hover:text-slate-50' />
          <p className='text-white group-hover:text-slate-50'>Add New Outlet</p>
        </button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <AnimatedDialogOverlay />
        <Dialog.Content className='fixed flex flex-col left-1/2 top-1/2 max-h-[85vh] w-[90vw] -translate-x-1/2 -translate-y-1/2 rounded-md bg-white p-[25px] shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none overflow-auto'>
          <CloseDialogButton />
          <Dialog.Title className='inline-flex justify-center'>
            <p>
              <strong className='text-lg'>Add Outlets</strong>
            </p>
          </Dialog.Title>
          <AddOutletsMultiStepForm />
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
