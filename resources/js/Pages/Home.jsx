import Layout from "@/Layouts/Layout.jsx";
import {Head, Link, usePage} from "@inertiajs/react";

export default function Home({ posts }) {
    const { component } = usePage();

    return (
        <>
            <Head title={component} />
            <h1 className="text-3xl">Hello</h1>
            <div>
                {posts.data.map(post => (
                    <div key={post.id} className="p-4 border-b border-gray-200">
                        <span className="font-bold">Posted: </span>
                        <span className="text-sm">{new Date(post.created_at).toLocaleTimeString()}</span>
                        <p className="font-medium">{post.body}</p>
                        <Link href={`/posts/${post.id}`} className="text-blue-500">Read more...</Link>
                    </div>
                ))}
            </div>
            <div className="flex justify-center mt-4">
                {posts.links.map(link => (
                    link.url ?
                        <Link
                            key={link.label}
                            href={link.url}
                            dangerouslySetInnerHTML={{__html: link.label}}
                            className={`p-1 mx-1 ${link.active ? "text-blue-500 font-bold" : ""
                            }`}
                        />
                        :
                        <span
                            key={link.label}
                            dangerouslySetInnerHTML={{__html: link.label}}
                            className="p-1 mx-1 opacity-0"
                        >
                        </span>
                ))}
            </div>
        </>
    );
}

