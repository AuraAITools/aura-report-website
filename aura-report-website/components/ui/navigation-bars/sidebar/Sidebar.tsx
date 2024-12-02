"use client";
import * as NavigationMenu from "@radix-ui/react-navigation-menu";
import SidebarGroup, { SidebarGroupProps } from "./SidebarGroup";
import { HomeIcon, SquareIcon } from "@radix-ui/react-icons";
import { useContext } from "react";
import { SideBarContext } from "@/components/providers/SideBarProvider";
import SidebarCollapseButton from "./SidebarCollapseButton";
import Image from "next/image";
import { SidebarItem } from "./SideBarItem";

export type SidebarProps = {
  items: SidebarGroupProps[];
};

export default function Sidebar({ items }: SidebarProps) {
  const { isExpanded } = useContext(SideBarContext);

  return (
    <NavigationMenu.Root
      hidden={!isExpanded}
      className="
          sticky
          left-0
          top-0
          bottom-0
          h-screen 
          bg-white
          shadow-lg 
          transition-all 
          duration-300 
          ease-in-out
          border-orange-300
          md:w-64
          overflow-x-hidden"
    >
      <div className="flex p-4 items-center">
        <Image
          src="/logo.png"
          alt="Aura Logo"
          className="animate-spin-slow"
          width={50}
          height={50}
        />
        <Image src="/wordmark.png" alt="Aura wordmark" width={80} height={50} />
        <div className="flex-1" />
        <SidebarCollapseButton />
      </div>
      <NavigationMenu.List>
        <SidebarItem
          title={"Home"}
          href={"/home"}
          leftIcon={<HomeIcon className="size-6" />}
          rightIcon={undefined}
        />
        {items.map((group, idx) => {
          return (
            <SidebarGroup
              key={idx}
              groupName={group.groupName}
              items={group.items}
              showSeparator={group.showSeparator}
            />
          );
        })}
      </NavigationMenu.List>
    </NavigationMenu.Root>
  );
}
