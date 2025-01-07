import React, {useEffect, useState} from 'react';
import {useForm, usePage} from "@inertiajs/react";
import { FaThumbsUp } from "react-icons/fa";

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
                <div className="border border-orange-500 rounded flex gap-2 items-center w-fit">
                    <p className="bg-orange-500 text-white border-r border-orange-500 px-1">{likes}</p>
                    <button
                        onClick={handleLike}
                        disabled={processing}
                        className={`pr-1 transition duration-300 ease-in-out ${liked ? 'text-orange-500 hover:text-black' : 'hover:text-orange-500'}`}
                    ><FaThumbsUp/></button>
                </div>
            </div>
        </>
    );

}
