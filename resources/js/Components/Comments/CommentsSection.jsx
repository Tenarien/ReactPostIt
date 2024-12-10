import React, {useEffect, useState} from 'react';
import CommentItem from './CommentItem.jsx';
import CreateCommentForm from './CreateCommentForm.jsx';
import {router} from "@inertiajs/react";
import {SyncLoader} from "react-spinners";

function CommentsSection({ post, comments, nextPageUrl, highlightedComment }) {
    const [allComments, setAllComments] = useState(comments);
    const [loading, setLoading] = useState(false);
    const [nextPage, setNextPage] = useState(nextPageUrl);

    const loadMoreComments = async () => {
        if (nextPage && !loading) {

            setLoading(true);

            router.get(nextPage, {}, {
                preserveScroll: true,
                preserveState: true,
                preserveUrl: true,
                replace: true,

                onSuccess: (response) => {
                    const { data: newComments, next_page_url: newNextPageUrl } = response.props.comments;
                    setAllComments(prevComments => [...prevComments, ...newComments]);
                    console.log("response: ", response)
                    console.log("new comments: ", newComments)
                    setNextPage(newNextPageUrl);
                    setLoading(false);
                },
                onError: (error) => {
                    console.error('Error loading more posts:', error);
                    setLoading(false);
                },
            });
        }
    };

    const handleScroll = () => {
        if (window.innerHeight + document.documentElement.scrollTop + 50 >= document.documentElement.offsetHeight && !loading) {
            loadMoreComments();
        }
    };

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll); // Clean up event listener on component unmount
    }, [nextPage, loading]);

    const addComment = (parentId, newComment) => {
        if (parentId === null) {
            // Add a top-level comment
            setAllComments(prevComments => [...prevComments, newComment]);
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

        setAllComments(prevComments => recursiveAddComment(prevComments));
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

        setAllComments((prevComments) => recursiveDelete(prevComments));
    };

    return (
        <div className="mt-6">
            <h2 className="text-xl font-bold">Comments</h2>

            {/* CommentItem Form */}
            <CreateCommentForm
                post={post}
                comments={allComments}
                addComment={addComment}
            />

            <div className="mt-4 space-y-2">
                {highlightedComment && (
                    <CommentItem
                        key={highlightedComment.id}
                        comment={highlightedComment}
                        post={post}
                        addComment={addComment}
                        onDelete={deleteComment}
                    />
                )}
                {allComments
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
            {/* Loading Spinner */}
            {loading && (
                <div className="text-center mt-6">
                    <SyncLoader
                        color="#ff6600"
                        loading={loading}
                        size={20}
                    />
                </div>
            )}
        </div>
    );
}

export default CommentsSection;
