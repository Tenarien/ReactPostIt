import {Link, router, usePage} from "@inertiajs/react";
import {formatDistanceToNow} from "date-fns";
import React, {useEffect, useState} from "react";
import {SyncLoader} from "react-spinners";
import PostReactions from "@/Components/Posts/PostReactions.jsx";

export default function UserPosts({posts}) {
    const [postData, setPostData] = useState(posts);
    const [nextPage, setNextPage] = useState(postData.next_page_url);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setPostData(posts);
    }, [posts]);

    const loadMorePosts = async () => {
        if (nextPage && !loading) {
            setLoading(true);

            router.get(nextPage, {}, {
                preserveScroll: true,
                preserveState: true,
                preserveUrl: true,
                replace: true,
                only: ['posts'],

                onSuccess: (page) => {
                    setPostData((prevData) => ({
                        ...page.props.posts,
                        data: [
                            ...prevData.data,
                            ...page.props.posts.data.filter(
                                (newPost) => !prevData.data.some((existingPost) => existingPost.id === newPost.id)
                            ),
                        ],
                    }));
                    setNextPage(page.props.posts.next_page_url);
                    setLoading(false);
                },
                onError: (error) => {
                    console.error('Error loading more posts:', error);
                    setLoading(false);
                },
            });
        }
    };

    const handleScroll = () => {
        if (window.innerHeight + document.documentElement.scrollTop + 50 >= document.documentElement.offsetHeight && !loading) {
            loadMorePosts();
        }
    };

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [nextPage, loading]);

    return (
        <div className="w-full mt-10 space-y-4">
            {postData.data.map((post) => (
                    <div
                        key={post.id}
                        className="p-4 border border-orange-500 rounded-md shadow-md flex flex-col"
                    >
                        <div className="flex items-center space-x-4">
                            <Link
                                href={`/profile/${post.user.id}`}
                            >
                                <span
                                    className="text-xl font-bold text-orange-500 hover:text-opacity-70 transition-all duration-300 mr-4">{post.user.name}</span>
                            </Link>
                            <p className="text-xs text-gray-500">
                                {formatDistanceToNow(new Date(post.created_at), {addSuffix: true})}
                            </p>
                        </div>

                        {/* Post Body */}
                        <p className="font-medium text-gray-800 break-words">{post.body}</p>

                        <div className="mt-4 flex items-center gap-4">
                            {/* Post Reactions */}
                            <PostReactions post={post}/>

                            {/* Read More Link */}
                            <Link
                                href={`/posts/${post.id}`}
                                className="block text-orange-500 hover:text-orange-600 font-semibold transition duration-300 ease-in-out"
                            >
                                Read more...
                            </Link>
                        </div>
                    </div>
                )
            )}
            {/* Loading Spinner */}
            {loading && (
                <div className="text-center mt-6">
                    <SyncLoader
                        color="#ff6600"
                        loading={loading}
                        size={20}
                    />
                </div>
            )}
        </div>
    );
}
