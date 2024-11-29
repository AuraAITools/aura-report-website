"use client";
import { Notification } from "./notification";
import { useNotifications } from "./notification-store";

export type NotificationsProps = {
  duration: number;
};

export const Notifications = ({ duration }: NotificationsProps) => {
  const { notifications, dismissNotification } = useNotifications();

  return (
    <div
      aria-live="assertive"
      className="fixed bottom-0 right-0 flex flex-col items-end"
    >
      {notifications.map((notification) => (
        <Notification
          duration={duration}
          key={notification.id}
          notification={notification}
          onDismiss={dismissNotification}
        />
      ))}
    </div>
  );
};
