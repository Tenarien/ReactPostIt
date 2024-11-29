import {useEffect, useState} from "react";
import {useForm, usePage} from "@inertiajs/react";

export default function FollowSection({user}) {
    const {props} = usePage()
    const isLoggedIn = Boolean(props.auth.user);
    const isCurrentUser = props.auth.user ? props.auth.user.id === user.id : false;
    const [followed, setFollowed] = useState(false);
    const [followers, setFollowers] = useState();
    const [following, setFollowing] = useState();

    useEffect(() => {
        setFollowers(user.followers.length);
        setFollowing(user.following.length);

        if (props.auth.user && Array.isArray(user.followers)) {
            const followed = user.followers.some(follower => follower.id === props.auth.user.id);
            setFollowed(followed);
        }
    }, [user]);

    const {data, setData, post: submitFollow, processing} = useForm({
        user_id: user.id ? user.id : undefined,
    });


    function handleFollow(e) {
        e.preventDefault();

        submitFollow(`/profile/${user.id}/follow`, {
            preserveScroll: true,
            onSuccess: () => {
                setFollowed(!followed);
                setFollowers(followed ? followers - 1 : followers + 1);
            },
            onError: (error) => {
                console.error("Follow request failed:", error);
            },
        });
    }

    if (!isLoggedIn) {
        return <p>Please log in to follow users.</p>;
    }

    return (
        <>
            <div className="flex items-center space-x-4">
                <div className="flex space-x-4">
                    <p>Followers: {followers}</p>
                    <span>|</span>
                    <p>Following: {following}</p>
                </div>
                <div>
                    {!isCurrentUser && (
                        <form>
                            <button
                                onClick={handleFollow}
                                disabled={processing}
                                className={`bg-white text-orange-500 px-4 py-2
                                    rounded-md shadow hover:bg-orange-600 hover:text-white transition-all duration-300
                            ${processing ? 'opacity-50 cursor-not-allowed' : ''}`}
                            >
                                {followed ? 'Unfollow' : 'Follow'}
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </>
    );
}
