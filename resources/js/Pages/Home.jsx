import CreatePostForm from "@/Components/Posts/CreatePostForm.jsx";
import {Head, Link, router, usePage} from "@inertiajs/react";
import React, {useEffect, useState} from "react";
import { FaArrowLeft } from "react-icons/fa";
import UserPosts from "@/Components/Posts/UserPosts.jsx";


export default function Home({ posts }) {
    const { props } = usePage();
    const [postData, setPostData] = useState(posts);

    const addNewPost = (newPost) => {
        setPostData((prevData) => ({
            ...prevData,
            data: [newPost, ...prevData.data],
        }));
    };

    return (
        <>
            <Head title="Home" />
            {props.auth.user && <CreatePostForm addNewPost={addNewPost} />}
            <div className="space-y-6 mt-6 w-full mx-auto">
                {/* Posts List */}
                {postData.data < 1 && (
                    <div className="flex gap-2">
                        <p>Can't find any posts,</p>
                        <div className="flex items-center gap-2 hover:underline text-orange-500 font-semibold">
                            <FaArrowLeft />
                            <Link
                                href="/"
                            >
                                Go back
                            </Link>

                        </div>
                    </div>
                )}
                <UserPosts posts={postData} />
            </div>
        </>
    );
}

