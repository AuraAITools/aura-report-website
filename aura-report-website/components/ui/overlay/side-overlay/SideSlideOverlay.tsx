"use client";

import React, { ReactNode, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { Cross1Icon } from "@radix-ui/react-icons";

export type SideSlideOverlayProps = {
  content: ReactNode;
  triggerButton: ReactNode;
  title?: string;
};

const SideSlideOverlay = ({
  content,
  triggerButton,
}: SideSlideOverlayProps) => {
  const [open, setOpen] = useState(false);

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>{triggerButton}</Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className='fixed inset-0 bg-black/50 data-[state=open]:animate-slideLeftAndFade data-[state=closed]:animate-slideRightAndFade' />

        <Dialog.Content className='fixed top-0 right-0 h-full rounded-l-xl w-3/4 max-w-full bg-white shadow-lg transform transition-transform duration-300 ease-in-out data-[state=open]:translate-x-0 data-[state=closed]:translate-x-full'>
          <div className='flex flex-col h-full'>
            <Dialog.Description className='h-full'>
              {content}
            </Dialog.Description>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default SideSlideOverlay;
