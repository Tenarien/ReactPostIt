import {useState} from "react";

export default function ContentReportModal({isOpen, onClose, onSubmit}) {
    const [selectedViolation, setSelectedViolation] = useState("");

    const handleReportSubmit = (e) => {
        e.preventDefault();
        if (selectedViolation) {
            onSubmit(selectedViolation);
            onClose();
        } else {
            alert("Please select a violation type.");
        }
    };

    return isOpen ? (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
            <div className="bg-white w-96 p-6 rounded shadow-lg">
                <h2 className="text-lg font-bold mb-4">Report Reason</h2>
                <form onSubmit={handleReportSubmit}>
                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-2">
                            Select a Violation:
                        </label>
                        <select
                            name="violation"
                            value={selectedViolation}
                            onChange={(e) => setSelectedViolation(e.target.value)}
                            className="w-full border px-3 py-2 rounded"
                        >
                            <option disabled value="">
                                -- Select an Option --
                            </option>
                            <option value="spam">Spam</option>
                            <option value="abusive">Abusive Content</option>
                            <option value="misinformation">Misinformation</option>
                        </select>
                    </div>
                    <div className="flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                        >
                            Report
                        </button>
                    </div>
                </form>
            </div>
        </div>
    ) : null;
}
