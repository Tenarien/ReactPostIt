import React from 'react';
import CommentItem from './CommentItem';
import CommentForm from './CommentForm';

function CommentsSection({ post, onCommentSubmit, commentData, setCommentData, processing, onCommentSuccess }) {
    return (
        <div className="mt-6">
            <h2 className="text-xl font-bold">Comments</h2>

            {/* Comment Form */}
            <CommentForm
                onSubmit={onCommentSubmit}
                commentData={commentData.body}
                onChange={e => setCommentData('body', e.target.value)}
                processing={processing}
                onCommentSucces={onCommentSuccess}
            />

            <div className="mt-4 space-y-2">
                {post.comments.map(comment => (
                    <CommentItem
                        key={comment.id}
                        comment={comment}
                    />
                ))}
            </div>
        </div>
    );
}

export default CommentsSection;
