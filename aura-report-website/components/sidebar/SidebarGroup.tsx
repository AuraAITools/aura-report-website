import { PropsWithChildren } from "react";
import Separator from "../ui/Separator";

export type SidebarGroupProps = {
  groupName: string | undefined;
  showSeparator: boolean;
} & PropsWithChildren;

export function SidebarGroup({
  groupName,

  showSeparator,
  children,
}: SidebarGroupProps) {
  return (
    <div className='flex flex-col'>
      {showSeparator && <Separator />}
      {groupName && (
        <p className='text-center text-gray-400 py-2'>{groupName}</p>
      )}
      {children}
    </div>
  );
}
