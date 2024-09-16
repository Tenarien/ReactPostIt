import React, { useState} from 'react';
import {useForm, usePage} from "@inertiajs/react";

function CommentForm({ post }) {
    const [showSubmit, setShowSubmit] = useState(false);

    const { data, setData, post: submitComment, processing: processing, errors, reset } = useForm({
        body: '',
        post_id: `${post.id}`,
        user_id: usePage().props.auth.user ? usePage().props.auth.user.id : undefined,
    });

    function handleCommentSubmit(e) {
        e.preventDefault();
        submitComment(`/posts/${post.id}/comments`, {
            onSuccess: () => {
              reset();
              setShowSubmit(false);
            },
            onError: () => console.error('Comment submission failed'),
        });
    }

    const handleFocus = () => {
        setShowSubmit(true);
    };

    const handleCancel = () => {
        setTimeout(() => setShowSubmit(false), 200);
        reset();
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
                            type="reset"
                            onClick={handleCancel}
                            disabled={processing}
                            className="px-4 py-2 mr-2 text-orange-500 border border-orange-500 rounded-lg hover:text-white hover:bg-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-400 transition duration-300 ease-in-out"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={processing || data.body.length < 10}
                            className=
                                {`px-4 py-2 text-white rounded-lg focus:outline-none focus:ring-2
                                    focus:ring-orange-400 transition duration-300 ease-in-out
                                    ${data.body.length >= 10 ? 'bg-orange-500 hover:bg-orange-700' : 'bg-gray-500'}`
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

export default CommentForm;
