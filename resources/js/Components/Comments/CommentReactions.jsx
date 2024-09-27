import React, { useEffect, useState } from 'react';
import {Link, useForm, usePage} from "@inertiajs/react";
import { ClipLoader } from "react-spinners";
import axios from "axios";

export default function CommentReactions({ comment }) {
    const { props } = usePage()
    const [commentLikes, setCommentLikes] = useState(comment.likes ? comment.likes.length : 0);
    const [likedComment, setLikedComment] = useState();
    const [loading, setLoading] = useState(false);

    const { data, setData, post: submitPost, processing } = useForm({
        liked: !likedComment,
        user_id: props.auth.user ? props.auth.user.id : undefined,
    })

    useEffect(() => {
        if (props.auth.user && Array.isArray(comment.likes)) {
            const userLiked = comment.likes.some(like => like.id === props.auth.user.id);
            setLikedComment(userLiked);
        }
    }, []);

    const updateCommentLikes = (comments, commentId) => {
        return comments.map(comment => {
            if (comment.replies && comment.replies.length > 0) {
                return {
                    ...comment,
                    replies: updateCommentLikes(comment.replies, commentId)
                };
            }
            return comment;
        });
    };

    const handleLike = async (e) => {
        e.preventDefault();
        if (processing) return;

        try {
            await submitPost(`/comments/${comment.id}/like`, {
                preserveScroll: true,
                liked: !likedComment,
                user_id: props.auth.user ? props.auth.user.id : undefined,
            });

            setCommentLikes(likedComment ? commentLikes - 1 : commentLikes + 1);
            setLikedComment(!likedComment);
        } catch (error) {
            console.error('Error liking comment:', error);
        }
    };


    return (
        <>
            <div>
                <div className="flex space-x-2">
                    {loading ? (
                        <ClipLoader
                         color="#808080"
                         loading={loading}
                         size={20}
                        />
                    ) : (
                        <>
                            <p>{commentLikes}</p>
                            {props.auth.user ? (<button
                                onClick={handleLike}
                                disabled={processing}
                                className={`hover:text-orange-500 transition duration-300 ease-in-out ${likedComment ? 'text-orange-500' : ''}`}
                            >
                                {likedComment ? "Liked" : "Like"}
                            </button>) :
                                (<Link href={`/login`}>
                                    <p className="hover:text-orange-500 transition duration-300 ease-in-out">Like</p>
                                </Link>)}
                        </>
                    )}
                </div>
            </div>
        </>
    );
}
