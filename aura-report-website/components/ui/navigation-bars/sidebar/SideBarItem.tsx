"use client";
import { useRouter } from "next/navigation";
import { ReactNode } from "react";
import * as NavigationMenu from "@radix-ui/react-navigation-menu";

export type SidebarItemProps = {
  title: string;
  href: string;
  leftIcon: ReactNode;
  rightIcon: ReactNode;
};

export function SidebarItem({
  title,
  href,
  leftIcon,
  rightIcon,
}: SidebarItemProps) {
  const router = useRouter();

  function navigate() {
    router.push(href);
  }

  return (
    <div className="group flex">
      <div className="mx-2 w-2 rounded-r-lg group-hover:bg-orange-300"/>
      <NavigationMenu.Item
        onClick={navigate}
        className="group flex flex-1 items-center align-middle my-2 gap-4 p-4 hover:bg-orange-300 hover:rounded-xl"
      >
        <div className="md:size-6">{leftIcon}</div>
        <p>{title}</p>
      </NavigationMenu.Item>
    </div>
  );
}
