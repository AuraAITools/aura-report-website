"use client";
import * as Toast from "@radix-ui/react-toast";
import { NotificationToast } from "./NotificationToast";
import { useNotifications } from "./notification-store";

export type NotificationsProps = {
  duration: number;
};

export const Notifications = ({ duration }: NotificationsProps) => {
  const { notifications } = useNotifications();

  return (
    <Toast.Provider swipeDirection='right'>
      {notifications.map((notification) => {
        return (
          <NotificationToast
            key={notification.id}
            notification={notification}
          />
        );
      })}
      <Toast.Viewport className='absolute bottom-0 right-0 z-1 m-0 flex list-none flex-col-reverse gap-2 p-2' />
    </Toast.Provider>
  );
};
