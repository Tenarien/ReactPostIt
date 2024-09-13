import React from 'react';
import {Link, useForm, usePage} from "@inertiajs/react";

export default function ReplyForm({ comment, postId, toggleReplies }) {
    const [showReplyForm, setShowReplyForm] = React.useState(false);
    const { props } = usePage()
    const { data, setData, post, processing, errors } = useForm({
        body: '',
        post_id: postId,
        user_id: usePage().props.auth.user ? usePage().props.auth.user.id : undefined,
        parent_id: comment.id,
    });

    const handleReplySubmit = (e) => {
        e.preventDefault();
        post(`/posts/${postId}/comments`, {
            onSuccess: () => {
                setShowReplyForm(false);
                toggleReplies();
            },
            onError: () => {
                console.error('Reply failed');
            }
        });
    };


    return (
        <>
            <div className="space-y-2">
                {/* Toggle Reply Form Visibility */}
                {props.auth.user ? (
                    <button
                        onClick={() => setShowReplyForm(!showReplyForm)}
                        className="text-xs text-orange-500 hover:text-orange-600 underline"
                    >
                        {showReplyForm ? 'Cancel' : 'Reply'}
                    </button>
                ) : (
                    <Link href={`/login`}>
                        <button className="text-xs text-orange-500 hover:text-orange-600 underline">
                            {showReplyForm ? 'Cancel' : 'Reply'}
                        </button>
                    </Link>
                )}

                {/* Reply Form */}
                {showReplyForm && (
                    <form onSubmit={handleReplySubmit}
                          className="mt-2 bg-gray-50 p-4 border border-gray-200 rounded-lg shadow-sm">
                        <textarea
                            value={data.body}
                            onChange={(e) => setData('body', e.target.value)}
                            placeholder="Write a reply..."
                            className="w-full p-3 border border-gray-300 rounded-lg focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                            rows="3"
                            required
                        />
                        {errors.body && (
                            <p className="text-xs text-red-600 font-semibold mt-1">{errors.body}</p>
                        )}
                        <button
                            type="submit"
                            disabled={processing}
                            className="mt-3 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-400 transition duration-300 ease-in-out"
                        >
                            {processing ? 'Replying...' : 'Post Reply'}
                        </button>
                    </form>
                )}
            </div>
        </>
    );
}
