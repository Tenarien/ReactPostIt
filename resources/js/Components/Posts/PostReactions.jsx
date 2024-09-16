import React, {useState} from 'react';
import { useForm, usePage} from "@inertiajs/react";

export default function PostReactions({ post, comments, hasLikedPost, postLikes }) {
    const { props } = usePage()
    const [likes, setLikes] = React.useState(postLikes.length)
    const [liked, setLiked] = useState(hasLikedPost);

    const { data, setData, post: submitPost, processing } = useForm({
        liked: hasLikedPost ? hasLikedPost : null,
        user_id: props.auth.user ? props.auth.user.id : undefined,
    });

    function handleLike(e)   {
        e.preventDefault();

        submitPost(`/posts/${post.id}/like`, {
            preserveScroll: true,
            onSuccess: () => {
                setLikes(liked ? likes - 1 : likes + 1);
                setLiked(!liked);},
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
                    className={`hover:text-orange-500 transition duration-300 ease-in-out ${hasLikedPost ? 'text-orange-500' : ''}`}
                >{hasLikedPost ? "Liked" : "Like"}</button>
            </div>
        </div>
        </>
    );

}
