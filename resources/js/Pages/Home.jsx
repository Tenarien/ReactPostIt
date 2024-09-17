import Layout from "@/Layouts/Layout.jsx";
import CreatePostForm from "@/Components/Posts/CreatePostForm.jsx";
import {Head, Link, usePage} from "@inertiajs/react";
import {formatDistanceToNow} from "date-fns";

export default function Home({ posts }) {
    const { component, props } = usePage();

    return (
        <>
            <Head title={component} />
            {props.auth.user && (<CreatePostForm />)}
            <div className="space-y-6 mt-6 w-full mx-auto">
                {/* Posts List */}
                {posts.data.map(post => (
                    <div key={post.id} className="p-4 border rounded-lg shadow-md bg-white border-gray-200">
                        {/* Post Header */}
                        <div className="flex justify-between items-center mb-2">
                            <span className="font-bold text-lg">{post.user.name}</span>
                            <span className="text-sm text-gray-500">
                    {formatDistanceToNow(new Date(post.created_at), {addSuffix: true})}
                </span>
                        </div>
                        {/* Post Body */}
                        <p className="font-medium text-gray-800">{post.body}</p>
                        {/* Read More Link */}
                        <Link
                            href={`/posts/${post.id}`}
                            className="block mt-4 text-orange-500 hover:text-orange-600 font-semibold transition duration-300 ease-in-out"
                        >
                            Read more...
                        </Link>
                    </div>
                ))}

                {/* Pagination Links */}
                <div className="flex justify-center mt-8 space-x-2">
                    {posts.links.map(link => (
                        link.url ? (
                            <Link
                                key={link.label}
                                href={link.url}
                                dangerouslySetInnerHTML={{__html: link.label}}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition duration-300 ease-in-out ${
                                    link.active ? 'bg-orange-500 text-white' : 'text-orange-500 hover:bg-orange-100'
                                }`}
                            />
                        ) : (
                            <span
                                key={link.label}
                                dangerouslySetInnerHTML={{__html: link.label}}
                                className="px-4 py-2 text-sm text-gray-400"
                            />
                        )
                    ))}
                </div>
            </div>
        </>
    );
}

