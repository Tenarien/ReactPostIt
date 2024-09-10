import React from 'react';
import CommentItem from './CommentItem.jsx';
import CommentForm from './CommentForm.jsx';


function CommentsSection({ post, parentComments, replies, onCommentSubmit, commentData, setCommentData, processing, onCommentSuccess, errors }) {

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
                errors={errors}
            />

            <div className="mt-4 space-y-2">
                {parentComments.map(comment => (
                    <CommentItem
                        key={comment.id}
                        comment={comment}
                        replies={replies}
                        postId={post.id}
                    />
                ))}
            </div>
        </div>
    );
}

export default CommentsSection;
