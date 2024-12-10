import {useState} from "react";
import {Link} from "@inertiajs/react";

const NotificationsDropdown = ({notifications}) => {
    const [isOpen, setIsOpen] = useState(false);
    const typeToUrl = {
        "App\\Models\\Post": "/posts",
        "App\\Models\\Comment": "/posts",
        "App\\Models\\User": "/profile",
    };

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="text-orange-500 hover:text-white font-semibold py-2 px-2 rounded-full border-2 bg-white hover:bg-orange-500 border-orange-500 hover:border-white transition-all duration-300"
            >
                {/* Notification Icon */}
                {notifications.length > 0 && (
                    <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
                )}
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="13" height="13" fill="currentColor">
                    <path
                        d="M12 2C10.3431 2 9 3.34315 9 5V5.25835C6.98495 6.02565 5.5 7.86969 5.5 10V14.5L4 16V17H20V16L18.5 14.5V10C18.5 7.86969 17.015 6.02565 15 5.25835V5C15 3.34315 13.6569 2 12 2ZM7.5 10C7.5 8.48263 8.61263 7.23566 10 6.76904V5C10 4.44772 10.4477 4 11 4C11.5523 4 12 4.44772 12 5V6.76904C13.3874 7.23566 14.5 8.48263 14.5 10V14.5H7.5V10ZM12 22C13.1046 22 14 21.1046 14 20H10C10 21.1046 10.8954 22 12 22Z"/>
                </svg>
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
                                {notifications.map((notification) => {
                                    const basePath = typeToUrl[notification.notifiable_type] || "/unknown";

                                    const href = `${basePath}/${notification.notifiable_id}`;

                                    if (notification.type === 'comment' && notification.data.comment_id) {
                                        return (
                                            <li key={notification.id} className="p-4 hover:bg-gray-100 cursor-pointer">
                                                <Link href={href} data={{comment: notification.data.comment_id}}>
                                                    <p className="text-sm text-gray-700">
                                                        {notification.data.message || "New notification"}
                                                    </p>
                                                    <small className="text-xs text-gray-400">
                                                        {new Date(notification.created_at).toLocaleString()}
                                                    </small>
                                                </Link>
                                            </li>
                                        );
                                    }
                                    if (notification.type === 'like' && notification.data.post_id) {
                                        return (
                                            <li key={notification.id} className="p-4 hover:bg-gray-100 cursor-pointer">
                                                <Link href={`/posts/${notification.data.post_id}`} data={{comment: notification.notifiable_id}}>
                                                    <p className="text-sm text-gray-700">
                                                        {notification.data.message || "New notification"}
                                                    </p>
                                                    <small className="text-xs text-gray-400">
                                                        {new Date(notification.created_at).toLocaleString()}
                                                    </small>
                                                </Link>
                                            </li>
                                        );
                                    }

                                    return (
                                        <li key={notification.id} className="p-4 hover:bg-gray-100 cursor-pointer">
                                            <Link href={href}>
                                                <p className="text-sm text-gray-700">
                                                    {notification.data.message || "New notification"}
                                                </p>
                                                <small className="text-xs text-gray-400">
                                                    {new Date(notification.created_at).toLocaleString()}
                                                </small>
                                            </Link>
                                        </li>
                                    );
                                })}
                            </ul>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default NotificationsDropdown;
