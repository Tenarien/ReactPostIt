import {Head, Link, useForm, usePage} from "@inertiajs/react";
import { formatDistanceToNow } from 'date-fns'
import {useEffect, useRef, useState} from "react";
import CommentsSection from "@/Components/Comments/CommentsSection.jsx";
import EditPostForm from "@/Components/Posts/EditPostForm.jsx";
import PostReactions from "@/Components/Posts/PostReactions.jsx";
import DeleteConfirmationModal from "@/Components/Modals/DeleteConfirmationModal.jsx";

export default function Show({ post, comments }) {
    const { props, component } = usePage();
    const { auth } = props;
    const {delete: destroy, processing} = useForm({
        user_id: props.auth.user ? props.auth.user.id : undefined,
        body: post.body,
    });

    const [showPostOptions, setShowPostOptions] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [modalMessage, setModalMessage] = useState("");

    const optionsRef = useRef(null);
    const buttonRef = useRef(null);
    useEffect(() => {
        function handleClickOutside(e) {
            if (optionsRef.current && !optionsRef.current.contains(e.target) &&
                buttonRef.current && !buttonRef.current.contains(e.target)) {
                setShowPostOptions(false);
            }
        }

        document.addEventListener("click", handleClickOutside);

        return () => {
            document.removeEventListener("click", handleClickOutside);
        };

    }, [setShowPostOptions]);

    const handleOpenDeleteModal = (e) => {
        e.preventDefault();
        setModalMessage("Are you sure you want to delete this post?");
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };

    const handlePostDeletion = (e) => {
        e.preventDefault();
        destroy(`/posts/${post.id}`);
        setShowModal(false);
    }

    function handleEditComplete() {
        setEditMode(false);
    }

    return (
        <>
            <Head title={post.body} />
            <div className="relative font-medium border p-4 mt-4 rounded-lg bg-gray-50 shadow-lg">
                {auth.user && post.user.id === auth.user.id && (<button
                    ref={buttonRef}
                    onClick={() => setShowPostOptions(!showPostOptions)}
                    className={`
                    absolute font-bold top-0 h-6 w-6 right-0 flex
                    items-center justify-center rounded hover:bg-orange-500 hover:bg-opacity-25 active:ring-2 ring-black
                    ${showPostOptions ? 'bg-orange-500 bg-opacity-50' : ''}
                    `}
                >...
                </button>)}
                {/* Post Header */}
                <div className="flex justify-between items-center mb-4">
                    <div>
                        <Link
                            href={`/profile/${post.user.id}`}
                        >
                            <span className="text-xl font-bold text-orange-500 hover:text-opacity-70 transition-all duration-300 mr-4">{post.user.name}</span>
                        </Link>
                        <span className="text-sm text-gray-500 font-light">
                            {formatDistanceToNow(new Date(post.created_at), {addSuffix: true})}
                        </span>
                    </div>
                    {/* Options */}
                    <div
                        ref={optionsRef}
                        className={`relative z-10 transition-all duration-500 ease-in-out ${showPostOptions ? `opacity-100` : `opacity-0`}`}>
                        {showPostOptions && post.user.id === auth.user.id && (<div
                            className={`absolute text-center bg-gray-100 w-20 py-4 shadow-lg rounded border border-orange-500 flex right-5 flex-col gap-2
                            ${showPostOptions ? `block` : `hidden`}`}>
                            <form onSubmit={handlePostDeletion}>
                                <button
                                    onClick={handleOpenDeleteModal}
                                    disabled={processing}
                                    className="text-sm text-orange-500 w-full p-1  border-orange-500 hover:bg-red-500 hover:text-white hover:shadow-md transition duration-300">
                                    {processing ? 'Deleting...' : 'Delete'}
                                </button>
                            </form>
                            <button
                                onClick={() => {
                                    setEditMode(!editMode);
                                    setShowPostOptions(!showPostOptions);
                                }}
                                className="text-sm text-orange-500 w-full p-1  border-orange-500 hover:bg-green-500 hover:text-white hover:shadow-md transition-all duration-300"
                            >Update
                            </button>
                        </div>)}
                    </div>
                </div>

                {editMode
                    ?
                    (<EditPostForm
                        post={post}
                        onEditComplete={handleEditComplete}
                    />)
                    :
                    (<p className="text-gray-800">{post.body}</p>)
                }

                <div className="mt-4">
                    <PostReactions
                        post={post}
                    />
                </div>
            </div>

            {/* CommentItem Section */}
            <CommentsSection
                post={post}
                comments={comments.data}
                nextPageUrl={comments.next_page_url}
            />
            {/* Delete Modal */}
            <DeleteConfirmationModal
                show={showModal}
                onClose={handleCloseModal}
                onConfirm={handlePostDeletion}
                message={modalMessage}
            />
        </>
    );
}
