import React, {useState} from 'react';
import ReplyForm from "@/Components/Comments/ReplyForm.jsx";

function CommentItem({ comment, replies, postId, onReply }) {
    const [showReplies, setShowReplies] = useState(false);
    const toggleReplies = () => {
        setShowReplies(!showReplies);
    };

    const filteredReplies = replies.filter(reply => reply.parent_id === comment.id);

    return (
        <div key={comment.id} className="p-2 rounded-lg">
            <p className="text-sm">{comment.body}</p>
            <div className="text-xs text-gray-500">
                Posted at {new Date(comment.created_at).toLocaleString()}
            </div>
            <div className="flex space-x-2">
                {/* ReplyForm form */}
                <ReplyForm
                    comment={comment}
                    postId={postId}
                    onReply={onReply}
                    toggleReplies={toggleReplies}

                />
                {/* Button to toggle replies */}
                {filteredReplies.length > 0 && (
                    <button
                        onClick={toggleReplies}
                        className="text-xs p-2 text-center text-blue-500 underline hover:bg-blue-500 hover:text-white hover:bg-opacity-50 rounded-full"
                    >{showReplies ? 'Hide Replies' : `Show Replies (${filteredReplies.length})`}</button>
                )}
            </div>
            {/* Rendered Replies recursively */}
            {showReplies && filteredReplies.length > 0 && (
                <div className="mt-2 ml-4 border-l border-gray-500 pl-2">
                    {filteredReplies.map(reply => (
                        <CommentItem
                            key={reply.id}
                            comment={reply}
                            replies={replies}
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
