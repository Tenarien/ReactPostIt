import {Head, Link, useForm, usePage} from "@inertiajs/react";
import CommentsSection from "@/Components/CommentsSection.jsx";

export default function Show({ post }) {
    const {delete: destroy, processing} = useForm();
    const { component } = usePage();

    const { data, setData, post: submitComment, processing: commentProcessing } = useForm({
        body: '',
        post_id: `${post.id}`,
    });


    function handlePostDeletion(e) {
        e.preventDefault();
        destroy(`/posts/${post.id}`);
    }

    function handleCommentSubmit(e) {
        e.preventDefault();
        submitComment(`/posts/${post.id}/comments`, {
            onError: () => console.error('Comment submission failed'),
        });
    }
    return (
        <>
            <Head title={component} />
            <h1 className="text-3xl font-bold text-center">Post</h1>
            <div className="font-medium border p-4 mt-4 rounded-lg bg-gray-50 shadow-lg">
                <div className="flex justify-between">
                    <div>
                        <span className="font-bold">Posted: </span>
                        <span className="text-sm font-thin">{new Date(post.created_at).toLocaleTimeString()}</span>
                    </div>
                    <div className="flex gap-2">
                        <form onSubmit={handlePostDeletion}>
                            <button disabled={processing}
                                    className="text-sm text-white rounded-full p-1 bg-red-500 hover:bg-opacity-70 hover:shadow-md transition duration-300">Delete
                            </button>
                        </form>
                        <Link href={`/posts/${post.id}/edit`}
                              className="text-sm text-white rounded-full p-1 bg-green-500 hover:bg-opacity-70 hover:shadow-md transition duration-300"
                        >Update
                        </Link>
                    </div>
                </div>

                <p>{post.body}</p>
            </div>

            {/* Comment Section */}
            <CommentsSection
                post={post}
                onCommentSubmit={handleCommentSubmit}
                commentData={data}
                setCommentData={setData}
                processing={commentProcessing}
            />
        </>
    );
}
