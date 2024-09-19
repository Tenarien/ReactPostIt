import React from 'react';

export default function DeleteConfirmationModal({ show, onClose, onConfirm, message}) {
    if (!show) return null;

    return (
        <>
            <div className="fixed top-0 z-40 left-0 w-screen h-screen bg-black bg-opacity-50">
                <div className="fixed top-0 left-0 z-50 w-screen h-screen flex flex-col items-center justify-center">
                    <div className="bg-white p-4 rounded-lg shadow-lg">
                        <h2 className="text-xl mb-2">Confirm</h2>
                        <p>{message}</p>
                        <div className="mt-4 flex space-x-2">
                            <button onClick={onConfirm}
                                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded">
                                Confirm
                            </button>
                            <button onClick={onClose}
                                    className="text-orange-500 hover:text-white px-4 py-2 border border-orange-500 hover:bg-orange-500 rounded">
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
