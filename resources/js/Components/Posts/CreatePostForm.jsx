import {Head, useForm, usePage} from "@inertiajs/react";

export default function Create() {
    const { data, setData, post, errors, processing } = useForm({
        body: "",
        user_id: usePage().props.auth.user.id,
    });
    const { component } = usePage();

    function submit(e) {
        e.preventDefault();
        post("/posts");
    }
    return (
        <>
            <Head title={component}/>
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
                            className={`py-2 px-6 text-white bg-orange-500 rounded-lg font-semibold shadow-md hover:bg-orange-600 transition duration-300 ease-in-out ${
                                processing ? 'opacity-50 cursor-not-allowed' : ''
                            }`}
                            disabled={processing}
                        >
                            {processing ? 'Posting...' : 'Create Post'}
                        </button>
                    </div>
                </form>
            </div>

        </>
    );
}