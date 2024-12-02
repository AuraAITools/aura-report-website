"use client";
import {
  CheckCircledIcon,
  CircleBackslashIcon,
  CrossCircledIcon,
  ExclamationTriangleIcon,
  InfoCircledIcon,
} from "@radix-ui/react-icons";

const icons = {
  info: <InfoCircledIcon className="size-6 text-blue-500" aria-hidden="true" />,
  success: (
    <CheckCircledIcon className="size-6 text-green-500" aria-hidden="true" />
  ),
  warning: (
    <ExclamationTriangleIcon
      className="size-6 text-yellow-500"
      aria-hidden="true"
    />
  ),
  error: (
    <CircleBackslashIcon className="size-6 text-red-500" aria-hidden="true" />
  ),
};

export type NotificationProps = {
  notification: {
    id: string;
    type: keyof typeof icons;
    title: string;
    message?: string;
  };
  duration: number;
  onDismiss: (id: string) => void;
};

export const Notification = ({
  notification: { id, type, title, message },
  onDismiss,
  duration,
}: NotificationProps) => {
  // no auto closing of notification
  if (duration > -1) {
    setTimeout(() => {
      onDismiss(id);
    }, duration * 1000);
  }

  // Dynamically create the background class

  return (
    <div className="flex w-full flex-col items-center sm:items-end z-1 m-2">
      <div className="w-full max-w-sm overflow-hidden rounded-lg bg-white ring-1 ring-orange-200">
        <div className="p-4" role="alert" aria-label={title}>
          <div className="flex">
            <div className="flex items-center">{icons[type]}</div>
            <div className="mx-auto">{title}</div>
            <CrossCircledIcon
              className="sm:size-4 text-orange-400 hover:text-orange-200 transition-colors duration-500"
              onClick={() => onDismiss(id)}
            />
          </div>
          <p className="max-w-full text-gray-500">{message}</p>
        </div>
      </div>
    </div>
  );
};
