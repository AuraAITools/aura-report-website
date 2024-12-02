"use client";
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import * as Toolbar from "@radix-ui/react-toolbar";
import SideBarExpandButton from "../sidebar/SideBarExpandButton";

export default function TopToolBar() {
  return (
    <div className="sticky top-0 flex-1 h-12 px-2 bg-white shadow-lg">
      <Toolbar.Root className="flex items-center gap-2 w-full">
        <SideBarExpandButton />
            <MagnifyingGlassIcon height="16" width="16" />
        <div className="ml-auto" />
      </Toolbar.Root>
    </div>
  );
}
