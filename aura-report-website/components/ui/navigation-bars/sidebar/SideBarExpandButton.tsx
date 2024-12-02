"use client";
import { SideBarContext } from "@/components/providers/SideBarProvider";
import { PinRightIcon } from "@radix-ui/react-icons";
import { useContext } from "react";

export default function SideBarExpandButton() {
  const { isExpanded, expandSidebar } = useContext(SideBarContext);
  return (
    <>
      {!isExpanded && (
        <div className="flex justify-center items-center md:size-6 rounded-md hover:bg-orange-400 hover:text-white" onClick={expandSidebar}>
          <PinRightIcon />
        </div>
      )}
    </>
  );
}
