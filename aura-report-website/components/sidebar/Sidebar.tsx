"use client";
import { useToggle } from "@/hooks/useToggle";
import { createContext, PropsWithChildren } from "react";
import { SidebarCollapseButton } from "./SidebarCollapseButton";
import SideBarExpandButton from "./SideBarExpandButton";
import { SidebarExpandedContent } from "./SidebarExpandedContent";
import { SidebarGroup } from "./SidebarGroup";
import { SidebarItem } from "./SidebarItem";
import { SidebarShelf } from "./SidebarShelf";
import SidebarShelfItem from "./SidebarShelfItem";

type SidebarContext = {
  isExpanded: boolean;
  collapseSidebar: () => void;
  expandSidebar: () => void;
};

export const SidebarContext = createContext<SidebarContext | undefined>(
  undefined,
);

function Sidebar({ children }: PropsWithChildren) {
  const { on: isExpanded, setOn: setIsExpanded } = useToggle(false);

  function collapseSidebar() {
    setIsExpanded(false);
  }

  function expandSidebar() {
    setIsExpanded(true);
  }

  return (
    <SidebarContext.Provider
      value={{ isExpanded, collapseSidebar, expandSidebar }}
    >
      {children}
    </SidebarContext.Provider>
  );
}

Sidebar.CollapseButton = SidebarCollapseButton;
Sidebar.ExpandButton = SideBarExpandButton;
Sidebar.Group = SidebarGroup;
Sidebar.Item = SidebarItem;
Sidebar.Shelf = SidebarShelf;
Sidebar.ShelfItem = SidebarShelfItem;
Sidebar.ExpandedContent = SidebarExpandedContent;
export default Sidebar;
