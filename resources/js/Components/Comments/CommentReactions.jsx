import React, { useEffect, useState } from 'react';
import { usePage } from "@inertiajs/react";
import { ClipLoader } from "react-spinners";
import axios from "axios";

export default function CommentReactions({ comment }) {
    const { props } = usePage()
    const [commentLikes, setCommentLikes] = useState([])
    const [likedComment, setLikedComment] = useState(false);
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(false);

    useEffect(() => {
        const fetchCommentLikes = async () => {
            setLoading(true);
            try {
                const response = await axios.get(`/comments/${comment.id}/likes`);
                const data = response.data;
                setCommentLikes(data.comment_likes_count || 0);
                setLikedComment(data.has_liked_comment || false);
            } catch (error) {
                console.error('Error fetching comment likes:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchCommentLikes();
    }, [comment.id]);

    const handleLike = async (e) => {
        e.preventDefault();
        if (processing) return;

        setProcessing(true);
        try {
            await axios.post(`/comments/${comment.id}/like`, {
                liked: !likedComment,
                user_id: props.auth.user ? props.auth.user.id : undefined,
            });

            setCommentLikes(likedComment ? commentLikes - 1 : commentLikes + 1);
            setLikedComment(!likedComment);
        } catch (error) {
            console.error('Error liking comment:', error);
        } finally {
            setProcessing(false);
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
                            <button
                                onClick={handleLike}
                                disabled={processing}
                                className={`hover:text-orange-500 transition duration-300 ease-in-out ${likedComment ? 'text-orange-500' : ''}`}
                            >
                                {likedComment ? "Liked" : "Like"}
                            </button>
                        </>
                    )}
                </div>
            </div>
        </>
    );

}
