"use client";
import { Notification } from "@/components/notifications/notification-store";
import {
  CheckCircledIcon,
  CircleBackslashIcon,
  CrossCircledIcon,
  ExclamationTriangleIcon,
  InfoCircledIcon,
} from "@radix-ui/react-icons";
import * as Toast from "@radix-ui/react-toast";
import React from "react";

const icons: Record<Notification["type"], React.ReactNode> = {
  info: <InfoCircledIcon className='size-6 text-blue-500' aria-hidden='true' />,
  success: (
    <CheckCircledIcon className='size-6 text-green-500' aria-hidden='true' />
  ),
  warning: (
    <ExclamationTriangleIcon
      className='size-6 text-yellow-500'
      aria-hidden='true'
    />
  ),
  error: (
    <CircleBackslashIcon className='size-6 text-red-500' aria-hidden='true' />
  ),
};

const notificationColor: Record<Notification["type"], string> = {
  info: "bg-blue-300",
  success: "bg-green-300",
  warning: "bg-yellow-300",
  error: "bg-red-300",
};

export type NotificationProps = {
  notification: {
    id: string;
    type: keyof typeof icons;
    title: string;
    message?: string;
  };
};

export function NotificationToast({ notification }: NotificationProps) {
  console.log(`colour :bg-${notificationColor[notification.type]}-300`);
  return (
    <Toast.Root className='grid grid-cols-5 w-80 bg-slate-100 rounded-lg shadow-2xl ring-1 ring-white data-[swipe=cancel]:translate-x-0 data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[state=closed]:animate-hide data-[state=open]:animate-slideIn data-[swipe=end]:animate-swipeOut data-[swipe=cancel]:transition-[transform_200ms_ease-out]'>
      <Toast.Title
        className={`col-span-full ${notificationColor[notification.type]} rounded-t-lg overflow-hidden text-white`}
      >
        <div className='flex w-full p-2 gap-4'>
          <div>{icons[notification.type]}</div>
          <p className='line-clamp-1 text-ellipsis'>{notification.title}</p>
          <Toast.Action
            asChild
            altText='close'
            className='ml-auto rounded-lg size-[20px]'
          >
            <CrossCircledIcon />
          </Toast.Action>
        </div>
      </Toast.Title>
      <Toast.Description
        className='col-span-full p-2 break-words line-clamp-4 text-ellipsis whitespace-normal'
        asChild
      >
        <p>{notification.message}</p>
      </Toast.Description>
    </Toast.Root>
  );
}

{
  /* <button
        className='inline-flex h-[35px] items-center justify-center rounded bg-white px-[15px] text-[15px] font-medium leading-[35px] text-violet11 shadow-[0_2px_10px] shadow-blackA4 outline-none hover:bg-mauve3 focus:shadow-[0_0_0_2px] focus:shadow-black'
        onClick={() => {
          setOpen(false);
          window.clearTimeout(timerRef.current);
          timerRef.current = window.setTimeout(() => {
            eventDateRef.current = new Date();
            setOpen(true);
          }, 100);
        }}
      >
        Add to calendar
      </button> */
}
