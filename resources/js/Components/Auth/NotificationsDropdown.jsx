import React, { useState, useEffect } from "react";
import Echo from "laravel-echo";
import {usePage} from "@inertiajs/react";

const NotificationsDropdown = () => {
    const [isOpen, setIsOpen] = useState(false);
    const {props} = usePage();
    const notifications = props.notifications || [];
    console.log(props)

    useEffect(() => {
        const userId = props.auth.user.id;

        // Listen for real-time notifications using Laravel Echo
        window.Echo.private(`user.notifications.${userId}`)
            .listen("NotificationCreated", (event) => {
                console.log("New notification received:", event);

                // Update notifications dynamically
                props.notifications.unshift(event.notification);
            });

        return () => {
            window.Echo.disconnect();
        };
    }, [props]);

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="font-semibold py-2 px-2 rounded-full bg-white ring-1 ring-orange-500 hover:bg-orange-500 focus:outline-none focus:ring-1 focus:ring-white"
            >
                {/* Notification Icon */}
            </button>
            {isOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200">
                    <div className="py-2 px-4 border-b border-gray-100">
                        <h3 className="text-lg font-medium text-gray-800">Notifications</h3>
                    </div>
                    <div className="max-h-60 overflow-y-auto">
                        {notifications.length === 0 ? (
                            <p className="p-4 text-gray-500">No notifications</p>
                        ) : (
                            <ul className="divide-y divide-gray-100">
                                {notifications.map((notification) => (
                                    <li key={notification.id} className="p-4 hover:bg-gray-100 cursor-pointer">
                                        <p className="text-sm text-gray-700">
                                            {notification.data.message || "New notification"}
                                        </p>
                                        <small className="text-xs text-gray-400">
                                            {new Date(notification.created_at).toLocaleString()}
                                        </small>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default NotificationsDropdown;
