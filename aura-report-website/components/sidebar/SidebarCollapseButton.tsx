"use client";
import { PinLeftIcon } from "@radix-ui/react-icons";
import { useSidebarContext } from "./Sidebar.hooks";

export function SidebarCollapseButton() {
  const { collapseSidebar } = useSidebarContext();

  return (
    <div
      className='flex justify-center items-center p-2 rounded-md hover:bg-orange-400 hover:text-white'
      onClick={collapseSidebar}
    >
      <PinLeftIcon className='md:size-6' />
    </div>
  );
}
