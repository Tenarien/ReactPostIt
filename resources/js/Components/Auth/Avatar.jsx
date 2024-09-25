import React, {useEffect, useRef, useState} from "react";
import {Link} from "@inertiajs/react";
import { motion } from "framer-motion";

const MotionLink = motion(Link);


function Avatar({ user }) {
    const username = user.substring(0, 1).toUpperCase();
    const [showMenu, setShowMenu] = useState(false);
    const [profileClicked, setProfileClicked] = useState(false);
    const [logoutClicked, setLogoutClicked] = useState(false);
    const menuRef = useRef(null);
    const avatarRef = useRef(null);

    const variants = {
        initial: { x: 0, filter: "blur(0px)", opacity: 1 },
        clicked: { x: 200, filter: "blur(5px)", opacity: 0.8 },
    };

    useEffect(() => {
        function handleClickOutside(e) {
            if (
                menuRef.current &&
                !menuRef.current.contains(e.target) &&
                avatarRef.current &&
                !avatarRef.current.contains(e.target)
            ) {
                setShowMenu(false);
            }
        }

        document.addEventListener("click", handleClickOutside);
        return () => {
            document.removeEventListener("click", handleClickOutside);
        };
    }, []);


    return (
        <>
            <div className="relative">
                <div>
                    {user
                        ?
                        <div>
                            <button
                                className="rounded-full border-2 border-orange-500
                            bg-white text-orange-500 text-center text-xl px-2
                            hover:bg-orange-500 hover:text-white hover:border-white
                            transition-all duration-300 ease-in-out"
                                ref={avatarRef}
                                onClick={e => setShowMenu(!showMenu)}
                            >{username}</button>
                        </div>
                        :
                        <div className="rounded-full border border-white px-2">
                            <p>G</p>
                        </div>
                    }
                </div>
                <motion.div
                    ref={menuRef}
                    initial={{opacity: 0, height: 0}}
                    animate={showMenu ? {opacity: 1, height: "auto"} : {opacity: 0, height: 0}}
                    transition={{duration: 0.3, ease: "easeInOut"}}
                    className="absolute top-10 shadow-lg flex flex-col justify-center items-center text-center space-y-2 right-0 bg-white py-2 rounded border-orange-500 border overflow-hidden"
                >
                    <div
                        className="text-xs text-orange-500 hover:text-white hover:bg-orange-500 transition-all duration-300 font-bold w-full"
                    >
                        <MotionLink
                            className="py-2 px-4"
                            as="button"
                            onClick={() => setProfileClicked(!logoutClicked)}
                            initial="initial"
                            animate={profileClicked ? "clicked" : "initial"}
                            variants={variants}
                            transition={{duration: 0.5, ease: "easeInOut"}}
                        >Profile</MotionLink>
                    </div>
                    <div
                        className="text-xs text-orange-500 hover:text-white hover:bg-orange-500 transition-all duration-300 font-bold"
                    >
                        <MotionLink
                            className="py-2 px-4"
                            href={`/logout`}
                            method="post"
                            as="button"
                            onClick={() => setLogoutClicked(!logoutClicked)}
                            initial="initial"
                            animate={logoutClicked ? "clicked" : "initial"}
                            variants={variants}
                            transition={{duration: 0.5, ease: "easeInOut"}}
                        >Logout</MotionLink>
                    </div>
                </motion.div>
            </div>
        </>
);
}

export default Avatar;
