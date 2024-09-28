import React, {useState} from "react";
import {Head, usePage} from "@inertiajs/react";
import { motion } from "framer-motion";
import EditProfileForm from "@/Components/Auth/EditProfileForm.jsx";

export default function Profile({ user }) {
    const { props } = usePage();
    const { auth } = props;
    const [isEditing, setIsEditing] = useState(false);
    const isCurrentUser = auth.user ? auth.user.id === user.id : false;
    const username = user.name.substring(0, 1).toUpperCase();

    const onCompleteEdit = () => {
        setIsEditing(false);
    }

    return (
        <>
            <Head title={user.name}/>
            <div className="flex justify-center items-center">
                <div className="bg-white shadow-md overflow-hidden w-full max-w-4xl">
                    {/* Header */}
                    <div className="relative bg-orange-500 p-8 pb-20 text-white text-center rounded-t-lg">
                        <div className="relative w-24 h-24 mx-auto mb-4 border-4 border-white rounded-full ">
                            <div className="flex justify-center items-center bg-white w-full h-full rounded-full border-4 border-orange-500">
                                <p className="text-3xl font-bold text-orange-500">{username}</p>
                            </div>
                        </div>
                        <h1 className="text-3xl font-bold">{user.name || "John Doe"}</h1>
                        <p className="text-sm opacity-75">{user.email || "john.doe@example.com"}</p>

                        {/* Button to Trigger Form (Visible only if the current user is viewing their own profile) */}
                        {isCurrentUser && (
                            <button
                                onClick={() => setIsEditing(!isEditing)}
                                className="absolute right-4 bottom-4 bg-white text-orange-500 px-4 py-2 mt-4
                                    rounded-md shadow hover:bg-orange-600 hover:text-white transition-all duration-300"
                            >
                                {isEditing ? "Close Edit Profile" : "Edit Profile"}
                            </button>
                        )}
                    </div>

                    {/* Body */}
                    <div className="p-8 space-y-8 rounded-b-lg border border-orange-500">
                        {/* Bio */}
                        <div>
                            <h2 className="text-2xl font-bold text-gray-800 mb-4">About Me</h2>
                            <p className="text-gray-600 leading-relaxed">
                                {user.bio || "This is a short bio about the user."}
                            </p>
                        </div>

                        <EditProfileForm
                            user={user}
                            onCompleteEdit={onCompleteEdit}
                            isEditing={isEditing}
                            isCurrentUser={isCurrentUser}
                        />
                    </div>
                </div>
            </div>
        </>
    );
}
