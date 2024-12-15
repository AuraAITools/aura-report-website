"use client";
import { PinRightIcon } from "@radix-ui/react-icons";
import { useSidebarContext } from "./Sidebar.hooks";

export type SideBarExpandButtonProps = {
  show: boolean;
};
export default function SideBarExpandButton() {
  const { isExpanded, expandSidebar } = useSidebarContext();
  return (
    <>
      {!isExpanded && (
        <div
          className='flex justify-center items-center md:size-6 rounded-md hover:bg-orange-400 hover:text-white'
          onClick={expandSidebar}
        >
          <PinRightIcon />
        </div>
      )}
    </>
  );
}
