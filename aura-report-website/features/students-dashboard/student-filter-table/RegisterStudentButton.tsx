import * as Dialog from "@radix-ui/react-dialog";
import MultiStepForm from "../multistep-form/MultiStepForm";

export default function RegisterStudentButton() {
  return (
    <Dialog.Root>
      <Dialog.Trigger className='bg-orange-300 rounded-md hover:bg-orange-400 text-white p-2 '>
        <button>Register</button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className='fixed inset-0 bg-gray-300 opacity-50' />
        <Dialog.Content className='fixed flex flex-col left-1/2 top-1/2 max-h-[85vh] w-[90vw] -translate-x-1/2 -translate-y-1/2 rounded-md bg-white p-[25px] shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none overflow-auto'>
          <MultiStepForm />
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
