import {Head, useForm, usePage} from "@inertiajs/react";

export default function Create() {
    const { data, setData, post: post, errors, processing, reset } = useForm({
        body: "",
        user_id: usePage().props.auth.user.id,
    });
    const { component } = usePage();

    function submit(e) {
        e.preventDefault();
        post("/posts", {
            preserveScroll: true,
            onSuccess: () => reset(),
        });
    }
    return (
        <>
            <div className="relative mx-auto p-6 border-2 border-gray-500 rounded-lg shadow-lg bg-white">
                <form onSubmit={submit} className="space-y-4">
                    {/* Textarea for the post content */}
                    <textarea
                        className="w-full h-32 p-4 text-sm border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none"
                        rows="3"
                        placeholder="Write your post..."
                        value={data.body}
                        onChange={(e) => setData('body', e.target.value)}
                    />
                    {/* Error message for the body */}
                    {errors.body && (
                        <p className="text-sm text-red-600 font-medium">{errors.body}</p>
                    )}

                    {/* Submit button */}
                    <div className="flex justify-end">
                        <button
                            type="submit"
                            className={`py-2 px-6 text-white rounded font-semibold
                             shadow-md transition duration-300 ease-in-out
                             ${processing ? 'opacity-50 cursor-not-allowed' : ''}
                             ${data.body.length >= 10 ? 'bg-orange-500 hover:bg-orange-700' : 'bg-gray-500'}`}
                            disabled={processing || data.body.length < 10}
                        >
                            {processing ? 'Posting...' : 'Create Post'}
                        </button>
                    </div>
                </form>
            </div>

        </>
    );
}
