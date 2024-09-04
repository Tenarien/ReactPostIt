import { Link } from '@inertiajs/react'

export default function Layout({ children }) {
    return (
        <>
            <header className="py-2 px-10 bg-zinc-600 text-white">
                <nav className="flex items-center justify-between font-bold text-lg">
                    <Link className="p-2 hover:bg-zinc-400 hover:bg-opacity-50 rounded-lg" href="/">Home</Link>
                    <Link className="p-2 hover:bg-zinc-400 hover:bg-opacity-50 rounded-lg" href="/create">Create</Link>
                </nav>
            </header>

            <main>
                {children}
            </main>
        </>
    );
}
