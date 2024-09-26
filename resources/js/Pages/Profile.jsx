import React, {useState} from "react";
import {usePage} from "@inertiajs/react";
import { motion } from "framer-motion";

export default function Profile({ user }) {
    const [isEditing, setIsEditing] = useState(false);
    const username = user.name.substring(0, 1).toUpperCase();
    const { props } = usePage();
    const { auth } = props;

    const isCurrentUser = auth.user ? auth.user.id === user.id : false;

    const expandVariants = {
        hidden: { height: 0, opacity: 0 },
        visible: { height: "auto", opacity: 1 },
    };

    return (
        <>
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

                        {/* Edit Profile Form with Framer Motion (Visible only if the current user is editing) */}
                        {isCurrentUser && (
                            <motion.div
                                className="overflow-hidden"
                                initial="hidden"
                                animate={isEditing ? "visible" : "hidden"}
                                variants={expandVariants}
                                transition={{ duration: 0.5, ease: "easeInOut" }}
                            >
                                <div className="p-6 bg-gray-50">
                                    <div className="space-y-4">
                                        <h2 className="text-2xl font-bold text-gray-800 mb-4">Edit Profile</h2>
                                        <form className="space-y-4">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700">Name</label>
                                                    <input
                                                        type="text"
                                                        defaultValue={user.name || ""}
                                                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700">Email</label>
                                                    <input
                                                        type="email"
                                                        defaultValue={user.email || ""}
                                                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500"
                                                    />
                                                </div>
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700">Bio</label>
                                                <textarea
                                                    rows="4"
                                                    defaultValue={user.bio || ""}
                                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500"
                                                />
                                            </div>

                                            <div className="text-right">
                                                <button
                                                    type="submit"
                                                    className="bg-orange-500 text-white px-4 py-2 rounded-md shadow hover:bg-orange-600 transition-all duration-300"
                                                >
                                                    Save Changes
                                                </button>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}
