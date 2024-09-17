import React from 'react';
import CommentItem from './CommentItem.jsx';
import CommentForm from './CommentForm.jsx';


function CommentsSection({ post, comments }) {

    return (
        <div className="mt-6">
            <h2 className="text-xl font-bold">Comments</h2>

            {/* Comment Form */}
            <CommentForm
                post={post}
            />

            <div className="mt-4 space-y-2">
                {comments.map(comment => (
                    <CommentItem
                        key={comment.id}
                        comment={comment}
                        postId={post.id}
                    />
                ))}
            </div>
        </div>
    );
}

export default CommentsSection;
