import React, { Fragment } from 'react';

import {
  CheckCircleIcon,
  ExclamationCircleIcon,
  XCircleIcon,
  InformationCircleIcon,
} from '@heroicons/react/outline';
import { XIcon } from '@heroicons/react/solid';
import { Transition } from '@headlessui/react';
import { useRecoilState, useRecoilValue } from 'recoil';

import { notificationsAtom } from '@/recoil/posts/atoms';
import { NotificationItem } from '@/module/types';

// https://github.com/alan2207/bulletproof-react/tree/master/src/components/Notifications

const icons = {
  info: <InformationCircleIcon className="h-6 w-6 text-blue-500" aria-hidden="true" />,
  success: <CheckCircleIcon className="h-6 w-6 text-green-500" aria-hidden="true" />,
  warning: <ExclamationCircleIcon className="h-6 w-6 text-yellow-500" aria-hidden="true" />,
  error: <XCircleIcon className="h-6 w-6 text-red-500" aria-hidden="true" />,
};

type NotificationProps = {
  notification: NotificationItem;
};

const Notification: React.FC<NotificationProps> = ({ notification }) => {
  const [notifications, setNotifications] = useRecoilState(notificationsAtom);
  const {
    id,
    type,
    title,
    status,
    message,
  } = notification;

  const dismissNotification = () => {
    setNotifications(notifications.slice().filter((n) => n.id !== id));
  };

  return (
    <div className="w-full flex flex-col items-center space-y-4 sm:items-end">
      <Transition
        show
        as={Fragment}
        enter="transform ease-out duration-300 transition"
        enterFrom="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
        enterTo="translate-y-0 opacity-100 sm:translate-x-0"
        leave="transition ease-in duration-100"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        <div className="max-w-sm w-full bg-white shadow-lg rounded-lg pointer-events-auto ring-1 ring-black ring-opacity-5 overflow-hidden">
          <div className="p-4" role="alert" aria-label="notification-title">
            <div className="flex items-start">
              <div className="flex-shrink-0">{icons[type]}</div>
              <div className="ml-3 w-0 flex-1 pt-0.5">
                <p className="text-sm font-medium text-gray-900">{title}</p>
                {status && (
                <p className="mt-1 text-sm text-gray-500">
                  status:
                  {status}
                </p>
                )}
                <p className="mt-1 text-sm text-gray-500">{message}</p>
              </div>
              <div className="ml-4 flex-shrink-0 flex">
                <button
                  type="button"
                  className="bg-white rounded-md inline-flex text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  onClick={() => {
                    dismissNotification();
                  }}
                >
                  <span className="sr-only">Close</span>
                  <XIcon className="h-5 w-5" aria-hidden="true" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </div>
  );
};

const Notifications: React.FC = () => {
  const notifications = useRecoilValue(notificationsAtom);

  return (
    <div
      aria-live="assertive"
      className="z-50 flex flex-col fixed inset-0 space-y-4 items-end px-4 py-6 pointer-events-none sm:p-6 sm:items-start"
    >
      {notifications.map((notification) => (
        <Notification
          key={notification.id}
          notification={notification}
        />
      ))}
    </div>
  );
};

export default Notifications;