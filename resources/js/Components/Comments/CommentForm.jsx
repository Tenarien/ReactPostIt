import React, {useRef, useState} from 'react';

function CommentForm({ onSubmit, value, onChange, processing, errors }) {
    const textareaRef = useRef();
    const [showSubmit, setShowSubmit] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(e);
        textareaRef.current.value = '';
    };

    const handleFocus = () => {
        setShowSubmit(true);
    };

    const handleBlur = () => {
        setTimeout(() => setShowSubmit(false), 200);
    };

    return (
        <form onSubmit={handleSubmit} className="mt-4">
                    <textarea
                        ref={textareaRef}
                        className="w-full border rounded-lg p-2"
                        placeholder="Add a comment..."
                        rows="1"
                        value={value}
                        onChange={onChange}
                        onFocus={handleFocus}
                        onBlur={handleBlur}
                    >
                    </textarea>
            {errors.body && <p className="text-sm text-opacity-70 text-red-600 font-semibold">{ errors.body }</p>}
            {showSubmit && (<button type="submit" disabled={processing}
                                    className="mt-2 bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 transition"
            >{processing ? 'Commenting...' : 'Comment'}
            </button>)}
        </form>
    );
}

export default CommentForm;
