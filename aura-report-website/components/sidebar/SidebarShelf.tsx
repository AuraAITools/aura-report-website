"use client";
import { motion } from "motion/react";
import { PropsWithChildren } from "react";
import { useSidebarContext } from "./Sidebar.hooks";

export type SidebarShelfProps = {} & PropsWithChildren;

export function SidebarShelf({ children }: SidebarShelfProps) {
  const { isExpanded, collapseSidebar } = useSidebarContext();

  return (
    <>
      {!isExpanded && (
        <motion.span
          className='
              flex
              flex-col
              sticky
              left-0
              top-0
              bottom-0
              md:w-14
              h-screen 
              shadow-lg 
              bg-white
              items-center
              py-4
              gap-4'
        >
          {children}
        </motion.span>
      )}
    </>
  );
}
