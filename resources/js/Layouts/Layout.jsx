import { Link, usePage } from '@inertiajs/react';
import Avatar from "@/Components/Auth/Avatar.jsx";
import Flash from "@/Layouts/Flash.jsx";
import LoginForm from "@/Components/Auth/LoginForm.jsx";
import NotificationsDropdown from "@/Components/Auth/NotificationsDropdown.jsx";
import SearchBar from "@/Components/Search/SearchBar.jsx";
import { AiFillHome, AiOutlineUser } from "react-icons/ai"; // Example icons
import { FaStream } from "react-icons/fa";

export default function Layout({ children }) {
    const { props, url } = usePage();
    const { auth } = props;


    return (
        <>
            {/* Top Header */}
            <header className="sticky w-full top-0 z-50 py-2 px-6 bg-zinc-600 text-white shadow-lg">
                <nav className="flex items-center justify-between gap-4">
                    <Link
                        href="/"
                        className={`hidden sm:flex flex-col items-center text-xs transition-all duration-300 ${
                            url === '/' ? 'text-orange-500' : 'hover:text-orange-500'
                        }`}
                    >
                        <AiFillHome
                            className={`text-xl transition-all duration-300 ${
                                url === '/' ? 'text-orange-500' : 'hover:text-orange-500'
                            }`}
                        />
                        <span>Home</span>
                    </Link>
                    {auth.user && (
                        <Link
                            href="/?following=1"
                            className={`hidden sm:flex flex-col items-center text-xs transition-all duration-300 ${
                                url.includes('following=1') ? 'text-orange-500' : 'hover:text-orange-500'
                            }`}
                        >
                            <FaStream
                                className={`text-xl transition-all duration-300 ${
                                    url.includes('following=1') ? 'text-orange-500' : 'hover:text-orange-500'
                                }`}
                            />
                            <span>Following</span>
                        </Link>
                    )}
                    <SearchBar />
                    {!auth.user ? (
                        <LoginForm />
                    ) : (
                        <div className="flex items-center gap-4">
                            <NotificationsDropdown />
                            <Avatar user={auth.user.name} />
                        </div>
                    )}
                </nav>
            </header>

            {/* Mobile Bottom Navigation */}
            <nav className="fixed z-50 bottom-0 left-0 w-full bg-zinc-600 text-white shadow-lg sm:hidden flex justify-around items-center py-1">
                <Link
                    href="/"
                    className={`flex flex-col items-center text-xs transition-all duration-300 ${
                        url === '/' ? 'text-orange-500' : 'hover:text-orange-500'
                    }`}
                >
                    <AiFillHome
                        className={`text-xl transition-all duration-300 ${
                            url === '/' ? 'text-orange-500' : 'hover:text-orange-500'
                        }`}
                    />
                    <span>Home</span>
                </Link>
                {auth.user && (
                    <Link
                        href="/?following=1"
                        className={`flex flex-col items-center text-xs transition-all duration-300 ${
                            url.includes('following=1') ? 'text-orange-500' : 'hover:text-orange-500'
                        }`}
                    >
                        <FaStream
                            className={`text-xl transition-all duration-300 ${
                                url.includes('following=1') ? 'text-orange-500' : 'hover:text-orange-500'
                            }`}
                        />
                        <span>Following</span>
                    </Link>
                )}
                {!auth.user ? (
                    <Link
                        href="/login"
                        className={`flex flex-col items-center text-xs transition-all duration-300 ${
                            url.startsWith('/login') ? 'text-orange-500' : 'hover:text-orange-500'
                        }`}
                    >
                        <AiOutlineUser
                            className={`text-xl transition-all duration-300 ${
                                url.startsWith('/login') ? 'text-orange-500' : 'hover:text-orange-500'
                            }`}
                        />
                        <span>Login</span>
                    </Link>
                ) : (
                    <Link
                        href="/profile"
                        className={`flex flex-col items-center text-xs transition-all duration-300 ${
                            url.startsWith('/profile') ? 'text-orange-500' : 'hover:text-orange-500'
                        }`}
                    >
                        <AiOutlineUser
                            className={`text-xl transition-all duration-300 ${
                                url.startsWith('/profile') ? 'text-orange-500' : 'hover:text-orange-500'
                            }`}
                        />
                        <span>Profile</span>
                    </Link>
                )}
            </nav>

            {/* Main Content */}
            <main className="mt-14 mb-14 mx-4 sm:mx-10 md:mx-20">
                {children}
                <Flash />
            </main>
        </>
    );
}
