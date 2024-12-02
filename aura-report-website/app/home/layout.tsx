import { SideBarContextProvider } from "@/components/providers/SideBarProvider";

import { PropsWithChildren } from "react";

export default function Layout({ children }: PropsWithChildren) {
  return <SideBarContextProvider>{children}</SideBarContextProvider>;
}
