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
            onSuccess: () => reset(),
            onError: () => console.error('Comment submission failed'),
        });
    }

    const handleFocus = () => {
        setShowSubmit(true);
    };

    const handleBlur = () => {
        setTimeout(() => setShowSubmit(false), 200);
    };

    return (
        <>
            <form onSubmit={handleCommentSubmit}
                  className={`relative ${showSubmit ? 'pb-14' : ''} mt-4 bg-gray-50 p-4 border border-gray-200 rounded-lg shadow-sm`}>
                <textarea
                    className="w-full p-3 border border-gray-300 rounded-lg focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                    placeholder="Add a comment..."
                    rows="2"
                    value={data.body}
                    onChange={e => setData('body', e.target.value)}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                />
                {errors.body && (
                    <p className="text-sm text-red-600 font-semibold mt-1">{errors.body}</p>
                )}
                {showSubmit && (
                    <div className="absolute bottom-3 right-4">
                        <button
                            type="submit"
                            disabled={processing}
                            className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-400 transition duration-300 ease-in-out"
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
