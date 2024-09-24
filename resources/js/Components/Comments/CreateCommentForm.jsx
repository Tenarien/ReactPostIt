import React, { useState} from 'react';
import {useForm, usePage} from "@inertiajs/react";

function CreateCommentForm({ post, comment, addComment, onReplyAdded }) {
    const [showSubmit, setShowSubmit] = useState(false);

    const { data, setData, post: submitComment, processing: processing, errors, reset } = useForm({
        body: '',
        post_id: post.id,
        user_id: usePage().props.auth.user ? usePage().props.auth.user.id : undefined,
        parent_id: comment ? comment.id : undefined,
    });

    function handleCommentSubmit(e) {
        e.preventDefault();

        const url = `/posts/${post.id}/comments`;

        submitComment(url, {
            onSuccess: (response) => {
                const newComment = response.props.post.comments[response.props.post.comments.length - 1];
                addComment(newComment.parent_id, newComment);
                reset();
                setShowSubmit(false);
                if (onReplyAdded) onReplyAdded();
            },
            onError: () => console.error('CommentItem submission failed'),
        });
    }

    const handleFocus = () => {
        setShowSubmit(true);
    };


    return (
        <>
            <form onSubmit={handleCommentSubmit}
                  className={`relative ${showSubmit ? 'pb-14' : ''} mt-4`}>
                <textarea
                    className="w-full p-3 border border-gray-300 rounded-lg focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                    placeholder="Add a comment..."
                    rows="2"
                    value={data.body}
                    onChange={e => setData('body', e.target.value)}
                    onFocus={handleFocus}
                />
                {errors.body && (
                    <p className="text-sm text-red-600 font-semibold mt-1">{errors.body}</p>
                )}
                {showSubmit && (
                    <div className="absolute bottom-3 right-0 text-xs">
                        <button
                            type="submit"
                            disabled={processing || data.body.length < 1}
                            className=
                                {`px-4 py-2 text-white rounded-lg focus:outline-none focus:ring-2
                                    focus:ring-orange-400 transition duration-300 ease-in-out
                                    ${data.body.length >= 1 ? 'bg-orange-500 hover:bg-orange-700' : 'bg-gray-500'}`
                                }
                        >
                            {processing ? 'Commenting...' : 'Comment'}
                        </button>
                    </div>
                )}
            </form>
        </>
    );
}

export default CreateCommentForm;
