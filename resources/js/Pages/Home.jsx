import CreatePostForm from "@/Components/Posts/CreatePostForm.jsx";
import {Head, Link, router, usePage} from "@inertiajs/react";
import { formatDistanceToNow } from "date-fns";
import {useEffect, useState} from "react";
import {SyncLoader} from "react-spinners";

export default function Home({ posts }) {
    const { props } = usePage();
    const [postData, setPostData] = useState(posts);
    const [loading, setLoading] = useState(false);
    const [nextPage, setNextPage] = useState(postData.next_page_url);

    const loadMorePosts = async () => {
        if (nextPage && !loading) {

            setLoading(true);

            router.get(nextPage, {}, {
                preserveScroll: true,
                preserveState: true,
                replace: true,
                only: ['posts'],

                onSuccess: (page) => {
                    setPostData({
                        ...page.props.posts,
                        data: [...postData.data, ...page.props.posts.data], // Append new posts
                    });
                    setNextPage(page.props.posts.next_page_url);
                },
                onError: (error) => {
                    console.error('Error loading more posts:', error);
                },
            });
            setLoading(false);
        }
    };

    const handleScroll = () => {
        if (window.innerHeight + document.documentElement.scrollTop + 50 >= document.documentElement.offsetHeight && !loading) {
            loadMorePosts();
        }
    };

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll); // Clean up event listener on component unmount
    }, [nextPage, loading]);

    return (
        <>
            <Head title="Home" />
            {props.auth.user && <CreatePostForm />}
            <div className="space-y-6 mt-6 w-full mx-auto">
                {/* Posts List */}
                {postData.data.map(post => (
                    <div key={post.id} className="p-4 border rounded-lg shadow-md bg-white border-gray-200">
                        {/* Post Header */}
                        <div className="flex justify-between items-center mb-2">
                            <span className="font-bold text-lg">{post.user.name}</span>
                            <span className="text-sm text-gray-500">
                                {formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}
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
                {/* Loading Spinner */}
                {loading &&
                    <div className="text-center py-10">
                        <SyncLoader
                            color="#ff6600"
                            loading={loading}
                            size={20}
                        />
                    </div>
                }
            </div>
        </>
    );
}

