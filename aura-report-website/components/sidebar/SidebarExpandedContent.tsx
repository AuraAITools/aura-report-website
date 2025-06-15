"use client";
import * as NavigationMenu from "@radix-ui/react-navigation-menu";
import { motion } from "motion/react";
import Image from "next/image";
import { PropsWithChildren } from "react";
import { useSidebarContext } from "./Sidebar.hooks";
import { SidebarCollapseButton } from "./SidebarCollapseButton";
import AuraLogo from "@/app/assets/logo.png";
import AuraWordMark from "@/app/assets/wordmark.png";

export function SidebarExpandedContent({ children }: PropsWithChildren) {
  const { isExpanded } = useSidebarContext();

  return (
    <>
      {isExpanded && (
        <motion.div
          className='
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
              overflow-x-hidden'
        >
          <NavigationMenu.Root>
            <div className='flex p-4 items-center'>
              <Image
                src={AuraLogo}
                alt='Aura Logo'
                className='animate-spin-slow'
                width={50}
                height={50}
              />
              <Image
                src={AuraWordMark}
                alt='Aura wordmark'
                width={80}
                height={50}
              />
              <div className='flex-1' />
              <SidebarCollapseButton />
            </div>
            <NavigationMenu.List>{children}</NavigationMenu.List>
          </NavigationMenu.Root>
        </motion.div>
      )}
    </>
  );
}
