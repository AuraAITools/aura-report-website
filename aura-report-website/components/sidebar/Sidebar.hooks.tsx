import { useContext } from "react";
import { SidebarContext } from "./Sidebar";

export function useSidebarContext() {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebarContext must be used within a Sidebar");
  }
  return context;
}
