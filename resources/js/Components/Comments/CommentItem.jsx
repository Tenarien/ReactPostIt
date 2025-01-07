import React, {useEffect, useRef, useState} from 'react';
import CommentReactions from "@/Components/Comments/CommentReactions.jsx";
import {Link, router, useForm, usePage} from "@inertiajs/react";
import {formatDistanceToNow} from "date-fns";
import EditCommentForm from "@/Components/Comments/EditCommentForm.jsx";
import DeleteConfirmationModal from "@/Components/Modals/DeleteConfirmationModal.jsx";
import CreateCommentForm from "@/Components/Comments/CreateCommentForm.jsx";
import ContentReportModal from "@/Components/Modals/ContentReportModal.jsx";

function CommentItem({comment, post, onDelete, addComment}) {
    const [showReplies, setShowReplies] = useState(false);
    const [loadingReplies, setLoadingReplies] = useState(false);
    const [showCommentOptions, setShowCommentOptions] = useState(false);
    const [showReplyForm, setShowReplyForm] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [showReportModal, setShowReportModal] = useState(false);
    const [modalMessage, setModalMessage] = useState("");
    const [visibleReplies, setVisibleReplies] = useState(5);
    const [thisComment, setThisComment] = useState(comment);
    const {props} = usePage();
    const {auth} = props;
    const optionsRef = useRef(null);
    const buttonRef = useRef(null);

    const {delete: destroy, processing} = useForm({
        user_id: auth.user ? auth.user.id : undefined,
        body: comment.body,
    });

    useEffect(() => {
        function handleClickOutside(e) {
            if (optionsRef.current && !optionsRef.current.contains(e.target) &&
                buttonRef.current && !buttonRef.current.contains(e.target)) {
                setShowCommentOptions(false)
            }
        }

        document.addEventListener("click", handleClickOutside);
        return () => {
            document.removeEventListener("click", handleClickOutside);
        };
    }, []);


    const toggleReplies = () => {
        setShowReplies(!showReplies);
    };

    const showMoreReplies = () => {
        setVisibleReplies(prev => prev + 5);
    };

    const handleOpenDeleteModal = (e) => {
        e.preventDefault();
        setModalMessage("Are you sure you want to delete this comment?");
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };

    const handleCommentDeletion = async (e) => {
        e.preventDefault();
        try {
            await destroy(`/comments/${comment.id}`, {
                preserveScroll: true,
                onSuccess: () => {
                    if (onDelete) onDelete(comment.id);
                }
            });
        } catch (error) {
            console.error('Error deleting comment:', error);
        }
        setShowModal(false);
    };

    const handleEditComplete = (updatedBody) => {
        if (updatedBody) {
            setThisComment((prev) => ({...prev, body: updatedBody}));
        }
        setEditMode(false);
    };

    const handleEditCancel = () => {
        setEditMode(false);
    };


    const handleReportSubmit = (violation) => {

        const reportData = new FormData();
        reportData.append('reportable_id', comment.id);
        reportData.append('reportable_type', 'Comment');
        reportData.append('reason', violation);

        router.post('/report', reportData, {
            forceFormData: true,
            preserveState: true,
            preserveScroll: true,
            onError: (errors) => console.log(errors),
        })
    };

    return (
        <div key={comment.id}
             className={`lg:pl-4 pl-0.5 pt-4 pb-4 bg-white border-l border-t border-b rounded-lg shadow-sm relative ${comment.highlighted && comment.highlighted ? 'border-orange-500 border' : 'border-gray-200'}`}>

            {/* CommentItem Header */}
            <div className="flex justify-between items-center mb-2">
                <div className="text-sm text-gray-700">
                    <Link
                        href={`/profile/${comment.user.id}`}
                        as="button"
                    >
                        <span
                            className="font-semibold text-orange-500 mr-2 hover:text-opacity-70 transition-all duration-300">
                            {comment.user ? comment.user.name : 'Unknown'}
                        </span>
                    </Link>
                    <span className="text-xs text-gray-500">
                        {formatDistanceToNow(new Date(comment.created_at), {addSuffix: true})}
                    </span>
                    <span className="text-xs text-gray-500">
                        {comment.created_at && comment.created_at !== comment.updated_at ? ' (edited)' : ''}
                    </span>
                </div>
                {auth.user && comment.status !== 'deleted' && (
                    <button
                        ref={buttonRef}
                        onClick={() => setShowCommentOptions(!showCommentOptions)}
                        className={`absolute font-bold top-0 h-6 w-6 right-0 flex items-center justify-center rounded hover:bg-orange-500 hover:bg-opacity-25 active:ring-2 ring-black ${showCommentOptions ? 'bg-orange-500 bg-opacity-50' : ''}`}
                    >...</button>
                )}

                {/* Options */}
                <div
                    ref={optionsRef}
                    className={`absolute z-40 right-0 transition-all duration-500 ease-in-out ${showCommentOptions ? 'opacity-100' : 'opacity-0'}`}
                >
                    {showCommentOptions && (
                        <div className="absolute text-center bg-gray-100 w-20 py-4 shadow-lg rounded border border-orange-500 flex right-5 flex-col gap-2">
                            {comment.user.id === auth.user.id ? (
                                <>
                                    <form onSubmit={handleCommentDeletion}>
                                        <button
                                            onClick={handleOpenDeleteModal}
                                            disabled={processing}
                                            className="text-sm text-orange-500 w-full p-1 border-orange-500 hover:bg-red-500 hover:text-white hover:shadow-md transition duration-300"
                                        >
                                            {processing ? 'Deleting...' : 'Delete'}
                                        </button>
                                    </form>
                                    <button
                                        onClick={() => {
                                            setEditMode(!editMode);
                                            setShowCommentOptions(false);
                                        }}
                                        className="text-sm text-orange-500 w-full p-1 border-orange-500 hover:bg-green-500 hover:text-white hover:shadow-md transition-all duration-300"
                                    >
                                        Update
                                    </button>
                                    <button
                                        onClick={() => setShowReportModal(true)}
                                        className="text-sm text-orange-500 w-full p-1 border-orange-500 hover:bg-red-500 hover:text-white hover:shadow-md transition-all duration-300"
                                    >
                                        Report
                                    </button>
                                </>
                            ) : (
                                <button
                                    onClick={() => setShowReportModal(true)}
                                    className="text-sm text-orange-500 w-full p-1 border-orange-500 hover:bg-red-500 hover:text-white hover:shadow-md transition-all duration-300"
                                >
                                Report
                                </button>
                            )}
                        </div>
                    )}
                </div>


            </div>

            {/* CommentItem Body */}
            {editMode
                ? <EditCommentForm comment={thisComment} onEditComplete={handleEditComplete}
                                   onEditCancel={handleEditCancel}/>
                : <p className="text-gray-800">{thisComment.body}</p>
            }

            <div className="flex items-center space-x-4">

                {/* CommentItem Reactions */}
                {comment.status !== 'deleted' && (
                    <CommentReactions
                        post={post}
                        comment={comment}
                    />
                )}

                {/* Button to toggle replies */}
                {comment.replies.length > 0 && (
                    <button
                        onClick={toggleReplies}
                        className="text-xs text-nowrap py-2 px-4 text-orange-500 border border-orange-500 rounded-full hover:bg-orange-500 hover:text-white transition duration-300 ease-in-out"
                    >
                        {loadingReplies ? 'Loading...' : (showReplies ? 'Hide Replies' : `Show Replies (${comment.replies.length})`)}
                    </button>
                )}
            </div>

            {/* Reply Form */}
            {comment.status === 'deleted' ? null : (
                props.auth.user ? (
                    <button
                        onClick={() => setShowReplyForm(!showReplyForm)}
                        className="text-xs text-orange-500 hover:text-orange-600 underline"
                    >
                        {showReplyForm ? 'Cancel' : 'Reply'}
                    </button>
                ) : (
                    <Link href={`/login`}>
                        <button className="text-xs text-orange-500 hover:text-orange-600 underline">
                            {showReplyForm ? 'Cancel' : 'Reply'}
                        </button>
                    </Link>
                )
            )}

            {showReplyForm && (
                <CreateCommentForm
                    post={post}
                    comment={comment}
                    addComment={addComment}
                    onReplyAdded={() => [setShowReplyForm(false), setShowReplies(true)]}
                />
            )}

            {/* Rendered Replies recursively */}
            {showReplies && comment.replies.length > 0 && (
                <div className="mt-2 border-l border-gray-500">
                    {comment.replies.slice(0, visibleReplies)
                        .map(reply => (
                            <CommentItem
                                key={reply.id}
                                post={post}
                                comment={reply}
                                addComment={addComment}
                                onDelete={onDelete}
                            />
                        ))}
                    {visibleReplies < comment.replies.length && (
                        <button className="p-2 text-orange-500 hover:underline"
                                onClick={showMoreReplies}>
                            Load more replies
                        </button>
                    )}
                </div>
            )}
            {/* Delete Modal */}
            <DeleteConfirmationModal
                show={showModal}
                onClose={handleCloseModal}
                onConfirm={handleCommentDeletion}
                message={modalMessage}
            />
            {/* Report Modal */}
            <ContentReportModal
                isOpen={showReportModal}
                onClose={() => setShowReportModal(false)}
                onSubmit={handleReportSubmit}
            />
        </div>
    );
}

export default CommentItem;
