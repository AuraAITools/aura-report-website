'use client'
import { createContext, PropsWithChildren, useState } from "react";

type SideBarContextType = {
  isExpanded: boolean;
  collapseSidebar: () => void;
  expandSidebar: () => void;
};

export const SideBarContext = createContext<SideBarContextType>({
  isExpanded: false,
  collapseSidebar: () => {},
  expandSidebar: () => {},
});

export function SideBarContextProvider({ children }: PropsWithChildren) {
  const [isExpanded, setIsExpanded] = useState(false);

  function collapseSidebar() {
    setIsExpanded(false);
  }

  function expandSidebar() {
    setIsExpanded(true);
  }

  return (
    <SideBarContext.Provider
      value={{ isExpanded, collapseSidebar, expandSidebar }}
    >
      {children}
    </SideBarContext.Provider>
  );
}
