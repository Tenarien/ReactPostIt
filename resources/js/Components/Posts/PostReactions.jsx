import React, {useEffect, useState} from 'react';
import {useForm, usePage} from "@inertiajs/react";

export default function PostReactions({post}) {
    const {props} = usePage()
    const [likes, setLikes] = React.useState(post.likes.length)
    const [liked, setLiked] = useState();

    const {data, setData, post: submitPost, processing} = useForm({
        liked: !liked,
        user_id: props.auth.user ? props.auth.user.id : undefined,
    });

    useEffect(() => {
        if (props.auth.user && Array.isArray(post.likes)) {
            const userLiked = post.likes.some(like => like.id === props.auth.user.id);
            setLiked(userLiked);
        }
    }, []);

    function handleLike(e) {
        e.preventDefault();

        submitPost(`/posts/${post.id}/like`, {
            preserveScroll: true,
            onSuccess: () => {
                setLikes(liked ? likes - 1 : likes + 1);
                setLiked(!liked);
            },
        });
    }


    return (
        <>
            <div>
                <div className="flex space-x-2">
                    <p>{likes}</p>
                    <button
                        onClick={handleLike}
                        disabled={processing}
                        className={`hover:text-orange-500 transition duration-300 ease-in-out ${liked ? 'text-orange-500' : ''}`}
                    >{liked ? "Liked" : "Like"}</button>
                </div>
            </div>
        </>
    );

}
