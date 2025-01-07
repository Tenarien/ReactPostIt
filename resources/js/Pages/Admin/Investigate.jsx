import React from "react";
import {Head, Link, usePage, useForm, router} from "@inertiajs/react";
import {Inertia} from "@inertiajs/inertia";

export default function Investigate() {
    const {report, relatedData} = usePage().props;

    const {post, processing} = useForm();

    const handleAction = (reportId, action) => {
        if (action === 'delete') {
            Inertia.delete(`/admin/${reportId}/delete`, {
            });
        } else {
            post(`/admin/${reportId}/${action}`, {
                preserveScroll: true,
                preserveState: true,
                onSuccess: () => {
                    router.get('/admin');
                },
            });
        }
    };

    return (
        <>
            <Head title={`Investigate Report #${report.id}`}/>

            <div className="bg-white p-6 rounded-lg shadow-lg w-full">
                <div className="flex justify-between">
                    <h2 className="text-xl font-bold mb-4">Investigate Report</h2>
                    <Link href={'/admin'} className="text-orange-500 font-semibold">Go Back</Link>
                </div>

                <p><strong>ID:</strong> {report.id}</p>
                <p><strong>Type:</strong> {report.reportable_type}</p>
                <p><strong>Content ID:</strong> {report.reportable_id}</p>
                <p><strong>Reported By:</strong> {report.reported_by}</p>
                <p><strong>Reason:</strong> {report.reason}</p>

                <div className="mt-4">
                    <h3 className="text-lg font-semibold">Related Content:</h3>
                    {report.reportable_type === 'App\\Models\\Post' && (
                        <p><strong>Post Content:</strong> {relatedData?.body}</p>
                    )}
                    {report.reportable_type === 'App\\Models\\Comment' && (
                        <p><strong>Comment Content:</strong> {relatedData?.body}</p>
                    )}
                    {report.reportable_type === 'App\\Models\\User' && (
                        <div>
                            <p><strong>User Name:</strong> {relatedData?.name}</p>
                            <p><strong>User Bio:</strong> {relatedData?.bio}</p>
                        </div>

                    )}
                </div>

                <div className="mt-6 flex justify-end gap-3">
                    {/* Resolve Button */}
                    <button
                        type="button"
                        className="bg-green-500 text-white px-3 py-1 rounded-md text-sm shadow hover:bg-green-600"
                        onClick={() => handleAction(report.id, 'resolve')}
                        disabled={processing}
                    >
                        Resolve
                    </button>

                    <button
                        type="button"
                        className="bg-gray-500 text-white px-3 py-1 rounded-md text-sm shadow hover:bg-gray-600"
                        onClick={() => handleAction(report.id, 'ignore')}
                        disabled={processing}
                    >
                        Ignore
                    </button>

                    <button
                        type="button"
                        className="bg-red-500 text-white px-3 py-1 rounded-md text-sm shadow hover:bg-red-600"
                        onClick={() => handleAction(report.id, 'delete')}
                        disabled={processing}
                    >
                        Delete
                    </button>
                </div>
            </div>

        </>
    );
}
