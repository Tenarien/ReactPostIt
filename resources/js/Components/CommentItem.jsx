import React from 'react';

function CommentItem({ comment }) {
    return (
        <div key={comment.id} className="border p-2 rounded-lg">
            <p className="text-sm">{comment.body}</p>
            <div className="text-xs text-gray-500">
                Posted at {new Date(comment.created_at).toLocaleString()}
            </div>
            <div>
                <button className="text-xs text-gray-500 underline">Reply</button>
            </div>
        </div>
    );
}

export default CommentItem;
