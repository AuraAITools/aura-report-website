import { SideBarContext } from "@/components/providers/SideBarProvider";
import { PinLeftIcon } from "@radix-ui/react-icons";
import { useContext } from "react";

export default function SidebarCollapseButton() {
  const { collapseSidebar } = useContext(SideBarContext);

  return (
    <div
      className="flex justify-center items-center p-2 rounded-md hover:bg-orange-400 hover:text-white"
      onClick={collapseSidebar}
    >
      <PinLeftIcon className="md:size-6"/>
    </div>
  );
}
