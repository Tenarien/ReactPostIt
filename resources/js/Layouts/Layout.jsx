import {Link, usePage} from '@inertiajs/react'
import Flash from "@/Layouts/Flash.jsx";
import LoginForm from "@/Components/Auth/LoginForm.jsx";

export default function Layout({ children }) {
    const { props } = usePage();
    const { auth } = props;
    const message = props.flash.message;

    return (
        <>
            <header className="sticky w-full top-0 z-50 py-2 px-10 bg-zinc-600 text-white shadow-lg">
                <nav className="flex items-center justify-between font-bold text-lg">
                    <Link className="p-2 hover:bg-zinc-400 hover:bg-opacity-50 rounded-lg" href="/">Home</Link>
                    {!auth.user ? (
                        <LoginForm />
                    ) : (<Link
                        href={`/logout`}
                        method="post"
                        as="button"
                        className="bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded"
                    >Logout</Link>)}

                </nav>
            </header>

            <main className="mt-10 mx-4 sm:mx-10 md:mx-20">
                {children}
                <Flash message={message} />
            </main>
        </>
    );
}
