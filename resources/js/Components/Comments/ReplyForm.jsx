import React from 'react';
import {useForm} from "@inertiajs/react";

export default function ReplyForm({ comment, postId, toggleReplies }) {
    const [showReplyForm, setShowReplyForm] = React.useState(false);
    const { data, setData, post, processing, errors } = useForm({
       body: '',
       post_id: postId,
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
        <div>
            <button onClick={() => setShowReplyForm(!showReplyForm)} className="text-xs p-2 text-center text-gray-500 hover:text-gray-400 underline">{showReplyForm ? 'Cancel' : 'Reply'}</button>

            {showReplyForm && (
                <form onSubmit={handleReplySubmit} className="mt-2">
                    <textarea
                        value={data.body}
                        onChange={(e) => setData('body', e.target.value)}
                        placeholder="Write a reply..."
                        className="w-full p-2 border rounded-lg"
                        rows="1"
                        required
                    />
                    {errors.body && <p className="text-xs text-opacity-70 text-red-600 font-semibold">{ errors.body }</p>}
                    <button
                        type="submit"
                        disabled={processing}
                        className="mt-2 px-4 py-2 bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 transition"
                    >{processing ? 'Replying' : 'Post Reply'}</button>
                </form>
            )}
        </div>
    );
}
