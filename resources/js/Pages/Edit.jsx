import {Head, useForm, usePage} from "@inertiajs/react";

export default function Edit({ post }) {
    const { data, setData, put, errors, processing } = useForm({
        body: post.body,
    });
    const { component } = usePage();

    function submit(e) {
        e.preventDefault();
        put(`/posts/${post.id}`);
    }

    return (
        <>
            <Head title={ component } />
            <h1 className="text-3xl text-center font-bold">Edit post</h1>
            <div className="mt-10 w-1/2 mx-auto">
                <form onSubmit={submit}>
                    <textarea
                        className="w-full p-4 border border-gray-500 rounded-lg"
                        rows="10"
                        value={data.body}
                        onChange={(e) => setData('body', e.target.value)}>
                    </textarea>
                    {errors.body && <p className="text-opacity-70 text-red-600 font-semibold">{ errors.body }</p>}
                    <button className="p-2 mt-4 bg-blue-500 text-white rounded-lg text-lg w-full" disabled={processing}>Edit post</button>
                </form>
            </div>
        </>
    );
}
