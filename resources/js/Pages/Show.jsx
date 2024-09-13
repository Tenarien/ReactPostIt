import {Head, Link, useForm, usePage} from "@inertiajs/react";
import { formatDistanceToNow } from 'date-fns'
import CommentsSection from "@/Components/Comments/CommentsSection.jsx";
import {useEffect, useState} from "react";

export default function Show({ post, comments }) {
    const {delete: destroy, processing} = useForm();
    const { component } = usePage();
    const { props } = usePage();
    const { auth } = props;

    const [showPostOptions, setShowPostOptions] = useState(false);

    function handlePostDeletion(e) {
        e.preventDefault();
        destroy(`/posts/${post.id}`);
    }

    return (
        <>
            <Head title={component} />
            <div className="relative font-medium border p-4 mt-4 rounded-lg bg-gray-50 shadow-lg">
                {auth.user && post.user.id === auth.user.id && (<button
                    onClick={() => setShowPostOptions(!showPostOptions)}
                    className={`
                    absolute font-bold top-0 h-6 w-6 right-0 flex
                    items-center justify-center rounded hover:bg-black hover:bg-opacity-25 active:ring-2 ring-black
                    ${showPostOptions ? 'bg-black bg-opacity-25' : ''}
                    `}
                >...
                </button>)}
                {/* Post Header */}
                <div className="flex justify-between items-center mb-4">
                    <div>
                        <span className="text-xl font-bold text-gray-800 mr-4">{post.user.name}</span>
                        <span className="text-sm text-gray-500 font-light">
                            {formatDistanceToNow(new Date(post.created_at), {addSuffix: true})}
                        </span>
                    </div>
                    <div
                        className={`relative transition-all duration-300 ease-in-out ${showPostOptions ? `opacity-100` : `opacity-0`}`}>
                        {showPostOptions && post.user.id === auth.user.id && (<div
                            className={`absolute bg-gray-200 p-3 rounded-lg border border-gray-400 flex right-5 flex-col gap-2 ${showPostOptions ? `block` : `hidden`}`}>
                            <form onSubmit={handlePostDeletion}>
                                <button disabled={processing}
                                        className="text-sm text-white w-full rounded-full p-1 bg-red-500 hover:bg-opacity-70 hover:shadow-md transition duration-300">Delete
                                </button>
                            </form>
                            <Link href={`/posts/${post.id}/edit`}
                                  className="text-sm w-full text-white rounded-full p-1 bg-green-500 hover:bg-opacity-70 hover:shadow-md transition duration-300"
                            >Update
                            </Link>
                        </div>)}
                    </div>
                </div>

                <p className="text-gray-800">{post.body}</p>
            </div>

            {/* Comment Section */}
            <CommentsSection
                post={post}
                comments={comments}
            />
        </>
    );
}
