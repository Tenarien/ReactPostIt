import React, { useState} from 'react';
import CommentItem from './CommentItem.jsx';
import CreateCommentForm from './CreateCommentForm.jsx';

function CommentsSection({ post }) {
    const [comments, setComments] = useState(post.comments);

    const addComment = (parentId, newComment) => {
        if (parentId === null) {
            // Add a top-level comment
            setComments(prevComments => [...prevComments, newComment]);
            return;
        }

        const recursiveAddComment = (commentsList) => {
            return commentsList.map(comment => {
                if (comment.id === parentId) {
                    // Add the new reply to the matching comment's replies array
                    return {
                        ...comment,
                        replies: [...comment.replies, newComment]
                    };
                }
                // Recursively search through the replies to find the matching parentId
                return {
                    ...comment,
                    replies: recursiveAddComment(comment.replies)
                };
            });
        };

        setComments(prevComments => recursiveAddComment(prevComments));
    };

    const deleteComment = (commentId) => {
        const recursiveDelete = (commentsList) => {
            return commentsList
                .filter(comment => comment.id !== commentId)
                .map(comment => ({
                    ...comment,
                    replies: recursiveDelete(comment.replies)
                }));
        };

        setComments((prevComments) => recursiveDelete(prevComments));
    };

    return (
        <div className="mt-6">
            <h2 className="text-xl font-bold">Comments</h2>

            {/* CommentItem Form */}
            <CreateCommentForm
                post={post}
                addComment={addComment}
            />

            <div className="mt-4 space-y-2">
                {comments
                    .filter(comment => !comment.parent_id) // Filter for top-level comments only
                    .map(comment => (
                        <CommentItem
                            key={comment.id}
                            comment={comment}
                            post={post}
                            addComment={addComment}
                            onDelete={deleteComment}
                        />
                    ))}
            </div>
        </div>
    );
}

export default CommentsSection;
