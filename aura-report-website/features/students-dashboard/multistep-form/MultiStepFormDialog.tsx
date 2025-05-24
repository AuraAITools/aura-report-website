import * as Dialog from "@radix-ui/react-dialog";
import { PlusCircledIcon } from "@radix-ui/react-icons";
import { AnimatePresence, motion } from "motion/react";
import MultiStepForm from "./CreateAccountAndStudentsMultiStepForm";

export function MultiStepFormDialog() {
  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <button className='group inline-flex gap-2 items-center justify-center rounded bg-white px-[15px] font-medium text-black shadow-xl hover:bg-orange-300'>
          <PlusCircledIcon className='size-6 text-green-300 group-hover:text-white' />
          <p className='group-hover:text-white'>Add New Student</p>
        </button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <AnimatedDialogOverlay />
        <Dialog.Content className='fixed flex flex-col left-1/2 top-1/2 max-h-[85vh] w-[90vw] -translate-x-1/2 -translate-y-1/2 rounded-md bg-white p-[25px] shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none overflow-auto'>
          <Dialog.Title>
            <MultiStepForm />
          </Dialog.Title>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

export function AnimatedDialogOverlay() {
  return (
    <AnimatePresence mode='wait'>
      <motion.div
        variants={{
          hidden: { opacity: 0 },
          visible: { opacity: 1 },
        }}
        initial='hidden'
        animate='visible'
        transition={{ duration: 3, type: "spring" }}
        exit='hidden'
      >
        <Dialog.Overlay className='fixed inset-0 bg-gray-300 opacity-50' />
      </motion.div>
    </AnimatePresence>
  );
}
