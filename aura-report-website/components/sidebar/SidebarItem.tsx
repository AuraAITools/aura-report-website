import * as NavigationMenu from "@radix-ui/react-navigation-menu";
import Link from "next/link";
import { ReactNode } from "react";

export type SidebarItemProps = {
  title: string;
  href: string;
  leftIcon: ReactNode;
};

export function SidebarItem({ title, href, leftIcon }: SidebarItemProps) {
  return (
    <NavigationMenu.Item>
      <Link
        href={href}
        className='group flex flex-1 items-center align-middle my-2 gap-4 p-4 hover:bg-orange-300 hover:text-white hover:rounded-xl'
      >
        <div className='md:size-6'>{leftIcon}</div>
        <p>{title}</p>
      </Link>
    </NavigationMenu.Item>
  );
}
