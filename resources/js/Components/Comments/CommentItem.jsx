import React, {useState} from 'react';
import ReplyForm from "@/Components/Comments/ReplyForm.jsx";
import CommentReactions from "@/Components/Comments/CommentReactions.jsx";
import {usePage} from "@inertiajs/react";
import {formatDistanceToNow} from "date-fns";

function CommentItem({ comment, postId, onReply }) {
    const [showReplies, setShowReplies] = useState(false);
    const [replies, setReplies] = useState([]);
    const [loadingReplies, setLoadingReplies] = useState(false);

    const toggleReplies = async () => {
        if (!showReplies && replies.length === 0) {
            setLoadingReplies(true);
            try {
                const response = await axios.get(`/comments/${comment.id}/replies`);
                setReplies(response.data);
            } catch (error) {
                console.error('Error fetching replies:', error);
            }
            setLoadingReplies(false);
        }
        setShowReplies(!showReplies);
    };


    const filteredReplies = comment.replies || [];

    return (
        <div key={comment.id} className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm relative">

            {/* Comment Header */}
            <div className="flex justify-between items-center mb-2">
                <div className="text-sm text-gray-700">
                    <span className="font-semibold text-orange-500 mr-2">
                        {comment.user ? comment.user.name : 'Unknown'}
                    </span>
                            <span className="text-xs text-gray-500">
                        {formatDistanceToNow(new Date(comment.created_at), {addSuffix: true})}
                    </span>
                </div>
            </div>

            {/* Comment Body */}
            <p className="text-gray-800 mb-2">{comment.body}</p>

            {/* Comment Reactions */}
            <CommentReactions
                postId={postId}
                comment={comment}
            />

            {/* Actions */}
            <div className="flex items-center space-x-2">
                {/* Button to toggle replies */}
                {filteredReplies.length > 0 && (
                    <button
                        onClick={toggleReplies}
                        className="text-xs text-nowrap top-0 py-2 px-4 text-orange-500 border border-orange-500 rounded-full hover:bg-orange-500 hover:text-white transition duration-300 ease-in-out"
                    >
                        {loadingReplies ? 'Loading...' : (showReplies ? 'Hide Replies' : `Show Replies (${filteredReplies.length})`)}
                    </button>
                )}

                {/* ReplyForm form */}
                <ReplyForm
                    comment={comment}
                    postId={postId}
                    onReply={onReply}
                    toggleReplies={toggleReplies}
                />
            </div>
            {/* Rendered Replies recursively */}
            {showReplies && replies.length > 0 && (
                <div className="mt-2 ml-4 border-l border-gray-500 pl-2">
                    {replies.map(reply => (
                        <CommentItem
                            key={reply.id}
                            comment={reply}
                            postId={postId}
                            onReply={onReply}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

export default CommentItem;
