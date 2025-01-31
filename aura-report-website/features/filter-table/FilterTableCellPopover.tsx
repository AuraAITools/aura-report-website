import { generateKey } from "@/utils/id";
import { Cross2Icon } from "@radix-ui/react-icons";
import * as Popover from "@radix-ui/react-popover";
import Link from "next/link";
import { TableValue } from "./types";

type FilterTableCellPopOverProps = {
  title: string;
  items: {
    id: string;
    name: string;
    url: string;
  }[];
  footerNav?: {
    title: string;
    url: string;
  };
};
export default function FilterTableCellPopOver(
  props: FilterTableCellPopOverProps,
) {
  return (
    <Popover.Root>
      <Popover.Trigger
        asChild
        className='underline hover:text-orange-400 hover:cursor-pointer'
      >
        <span>{props.items.length}</span>
      </Popover.Trigger>
      <FilterTableCellPopoverContent {...props} />
    </Popover.Root>
  );
}

type FilterTableCellPopOverContentProps = {
  title: string;
  items: TableValue[];
  footerNav?: {
    title: string;
    url: string;
  };
};
function FilterTableCellPopoverContent(
  props: FilterTableCellPopOverContentProps,
) {
  return (
    <Popover.Portal>
      <Popover.Content
        className='w-[260px] rounded bg-white p-5 shadow-[0_10px_38px_-10px_hsla(206,22%,7%,.35),0_10px_20px_-15px_hsla(206,22%,7%,.2)] will-change-[transform,opacity] data-[state=open]:data-[side=bottom]:animate-slideUpAndFade data-[state=open]:data-[side=left]:animate-slideRightAndFade data-[state=open]:data-[side=right]:animate-slideLeftAndFade data-[state=open]:data-[side=top]:animate-slideDownAndFade'
        sideOffset={5}
      >
        <h1 className='mb-8'>
          <strong>{props.title}</strong>
        </h1>
        <ul>
          {props.items.map((item, idx) => {
            return (
              <li
                key={generateKey(
                  "FilterTableCellPopoverContent_",
                  item.id,
                  idx.toString(),
                )}
                className='my-2 underline'
              >
                <Link className='hover:text-orange-400' href={item.url}>
                  {item.name}
                </Link>
              </li>
            );
          })}
        </ul>
        {props.footerNav && (
          <div className='mt-8'>
            <Link
              className='bg-orange-300 text-white hover:bg-orange-400 p-2 rounded-lg'
              href={props.footerNav.url}
            >
              {props.footerNav.title}
            </Link>
          </div>
        )}
        <Popover.Close
          className='absolute right-[5px] top-[5px] inline-flex size-[25px] cursor-default items-center justify-center rounded-full outline-none'
          aria-label='Close'
        >
          <Cross2Icon className='size-6 hover:text-orange-400' />
        </Popover.Close>
        <Popover.Arrow className='fill-white' />
      </Popover.Content>
    </Popover.Portal>
  );
}
