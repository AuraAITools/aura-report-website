import { useContext } from "react";
import SideBarExpandButton from "./SideBarExpandButton";
import { SideBarContext } from "@/components/providers/SideBarProvider";
import SidebarShelfItem, { SidebarShelfItemProps } from "./SidebarShelfItem";

export type SidebarShelfProps = {
  items: SidebarShelfItemProps[];
};

export function SidebarShelf({ items }: SidebarShelfProps) {
  const { isExpanded } = useContext(SideBarContext);

  const sidebarShelf = (
    <span
      className="
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
        gap-4"
    >
      <SideBarExpandButton />
      {items.map((item, idx) => {
        return <SidebarShelfItem icon={item.icon} key={idx} href={item.href} />;
      })}
    </span>
  );

  return <>{!isExpanded && sidebarShelf}</>;
}
