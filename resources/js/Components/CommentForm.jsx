import React, {useRef} from 'react';

function CommentForm({ onSubmit, value, onChange, processing, onCommentSuccess }) {
    const textareaRef = useRef();
    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(e);
        textareaRef.current.value = '';
    };

    return (
        <form onSubmit={handleSubmit} className="mt-4">
                    <textarea
                        ref={textareaRef}
                        className="w-full border rounded-lg p-2"
                        placeholder="Add a comment..."
                        rows="1"
                        value={value}
                        onChange={onChange}>
                    </textarea>
            <button type="submit" disabled={processing}
                    className="mt-2 bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 transition"
            >Submit Comment
            </button>
        </form>
    );
}

export default CommentForm;
