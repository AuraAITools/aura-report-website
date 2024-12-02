import Separator from "../../Separator";
import { SidebarItem, SidebarItemProps } from "./SideBarItem";

export type SidebarGroupProps = {
  groupName: string | undefined;
  items: SidebarItemProps[];
  showSeparator: boolean;
};

export default function SidebarGroup({
  groupName,
  items,
  showSeparator,
}: SidebarGroupProps) {
  return (
    <div className="flex flex-col">
      {showSeparator && <Separator />}
      {groupName && (
        <p className="text-center text-gray-400 py-2">{groupName}</p>
      )}
      {items.map((item, idx) => {
        return (
          <SidebarItem
            key={idx}
            title={item.title}
            href={item.href}
            leftIcon={item.leftIcon}
            rightIcon={item.rightIcon}
          />
        );
      })}
    </div>
  );
}
