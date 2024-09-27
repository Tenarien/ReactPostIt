import {Head, useForm, usePage} from "@inertiajs/react";

export default function EditCommentForm({ comment, onEditComplete, onEditCancel }) {
    const { props } = usePage();
    const { component } = usePage();
    const { data, setData, put, errors, processing } = useForm({
        body: comment.body,
        user_id: props.auth.user ? props.auth.user.id : undefined,
    });


    function submit(e) {
        e.preventDefault();
        put(`/comments/${comment.id}`, {
            preserveScroll: true,
            onSuccess: () => onEditComplete(data.body),
        });

    }

    return (
        <>
            <Head title={ component } />
            <div className="relative pb-12 w-full">
                <button
                    onClick={onEditCancel}
                    className="absolute text-sm top-0 right-0 px-2 text-orange-500 border border-orange-500 rounded-full hover:bg-orange-500 hover:text-white transform duration-300"
                >Cancel
                </button>
                <form onSubmit={submit}>
                    <textarea
                        className="w-full mt-8 p-4 border border-orange-500 rounded-lg"
                        rows="3"
                        value={data.body}
                        onChange={(e) => setData('body', e.target.value)}>
                    </textarea>
                    {errors.body && <p className="text-opacity-70 text-red-600 font-semibold">{ errors.body }</p>}
                    <button
                        className={`absolute bottom-0 right-0 p-2 text-white rounded text-lg ${data.body.length >= 1 ? 'bg-orange-500 hover:bg-orange-700' : 'bg-gray-500'}`}
                        disabled={processing || data.body.length < 1}
                    >Confirm
                    </button>
                </form>
            </div>
        </>
    );
}
