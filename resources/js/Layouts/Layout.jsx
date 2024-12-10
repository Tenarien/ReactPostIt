import {Link, usePage} from '@inertiajs/react'
import Avatar from "@/Components/Auth/Avatar.jsx"
import Flash from "@/Layouts/Flash.jsx";
import LoginForm from "@/Components/Auth/LoginForm.jsx";
import NotificationsDropdown from "@/Components/Auth/NotificationsDropdown.jsx";
import {useEffect, useState} from "react";

export default function Layout({ children }) {
    const { props } = usePage();
    const [notifications, setNotifications] = useState(props.notifications || []);
    const { auth } = props;

    useEffect(() => {
        if(!auth.user) return;

        Echo.private(`user.notifications.${auth.user.id}`)
            .listen("Notifications", (notification) => {
                console.log("Notification received:", notification);
                setNotifications((prev) => [notification, ...prev]);
            })
            .error((error) => console.error('Subscription error:', error));
    }, []);
    return (
        <>
            <header className="sticky w-full top-0 z-50 py-2 px-10 bg-zinc-600 text-white shadow-lg">
                <nav className="flex items-center justify-between font-bold text-lg">
                    <div
                    className="flex space-x-2"
                    >
                        <Link className="p-2 hover:bg-zinc-400 hover:bg-opacity-50 rounded-lg" href="/">Home</Link>
                        {auth.user && <Link className="p-2 hover:bg-zinc-400 hover:bg-opacity-50 rounded-lg" href="/?following=1">Following</Link>}
                    </div>


                    {!auth.user ? (
                        <LoginForm />
                    ) : (
                        <div className="flex gap-2 items-center">
                            <NotificationsDropdown notifications={notifications}/>
                            <Avatar
                                user={auth.user ? auth.user.name : null}
                            />
                        </div>)
                        }

                </nav>
            </header>

            <main className="mt-10 mx-4 sm:mx-10 md:mx-20">
                {children}
                <Flash/>
            </main>
        </>
    );
}
