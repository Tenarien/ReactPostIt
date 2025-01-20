import React from "react";
import {Head, Link, router, useForm} from "@inertiajs/react";
import { FaSearch } from "react-icons/fa";

export default function Admin({  reports: initialReports  }) {
    const [reports, setReports] = React.useState(initialReports.data || []);

    function handleInvestigate(report) {
        // Navigate to the investigate page for the selected report
        router.get(`/admin/${report.id}/investigate`);
    }

    const { data, setData, get, errors} = useForm({
        reportId: "",
    });

    const handleSearch = (e) => {
        e.preventDefault();
        get(`/admin`, {
            preserveScroll: true,
            preserveState: true,
            onSuccess: (page) => {
                if (page.props.reports) {
                    setReports(page.props.reports.data);
                    console.log(reports)
                }
            },
            onError: (errorMessages) => {
                console.error(errorMessages);
            },
        });
    };

    return (
        <>
            <Head title="Admin Dashboard - Reports" />
            <div className="min-h-screen">
                {/* Header */}
                <div className="flex justify-between items-center bg-orange-500 text-white p-6 rounded-lg shadow-md">
                    <h1 className="text-2xl font-bold">Reports Management</h1>
                </div>

                {/* Navigation Links */}
                <div className="mt-4 flex gap-4 justify-center">
                    <Link
                        href={'/admin?status=new'}
                        className="text-orange-500 hover:text-orange-700 font-semibold px-4 py-2 bg-white rounded shadow hover:shadow-md transition"
                    >
                        New Reports
                    </Link>
                    <Link
                        href={'/admin?status=ignored'}
                        className="text-gray-500 hover:text-gray-700 font-semibold px-4 py-2 bg-white rounded shadow hover:shadow-md transition"
                    >
                        Ignored Reports
                    </Link>
                    <Link
                        href={'/admin?status=resolved'}
                        className="text-green-500 hover:text-green-700 font-semibold px-4 py-2 bg-white rounded shadow hover:shadow-md transition"
                    >
                        Resolved Reports
                    </Link>
                    <Link
                        href={'/admin?status=deleted'}
                        className="text-red-500 hover:text-red-700 font-semibold px-4 py-2 bg-white rounded shadow hover:shadow-md transition"
                    >
                        Deleted Reports
                    </Link>
                </div>

                {/* Search Report */}
                <div className="mt-4 flex justify-center">
                    <form
                        onSubmit={handleSearch}
                        className="flex items-center space-x-2"
                    >
                        <input
                            type="text"
                            value={data.reportId}
                            onChange={(e) => setData("reportId", e.target.value)}
                            placeholder="Search by Report ID"
                            className={`px-4 py-2 border rounded-md focus:ring focus:ring-orange-300 ${
                                errors.error ? "border-red-500" : ""
                            }`}
                        />
                        <button
                            type="submit"
                            className="bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600 w-full h-full"
                        >
                            <FaSearch />
                        </button>
                    </form>
                </div>

                {/* Error Message */}
                {errors.error && (
                    <div className="mt-2 text-red-500 text-sm text-center">
                        {errors.error}
                    </div>
                )}

                {/* Reports Table */}
                <div className="mt-8 bg-white shadow-md rounded-lg overflow-hidden">
                    <table className="table-auto w-full border-collapse">
                        <thead className="bg-orange-500 text-white">
                        <tr>
                            <th className="py-4 px-6 text-left text-sm font-medium uppercase">ID</th>
                            <th className="py-4 px-6 text-left text-sm font-medium uppercase">Reportable Type</th>
                            <th className="py-4 px-6 text-left text-sm font-medium uppercase">Reportable ID</th>
                            <th className="py-4 px-6 text-left text-sm font-medium uppercase">Reported By</th>
                            <th className="py-4 px-6 text-left text-sm font-medium uppercase">Reason</th>
                            <th className="py-4 px-6 text-left text-sm font-medium uppercase">Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {reports.map((report, index) => (
                            <tr
                                key={report.id}
                                className={`${index % 2 === 0 ? "bg-gray-50" : "bg-white"} hover:bg-orange-100`}
                            >
                                <td className="py-4 px-6 text-sm text-gray-800">{report.id}</td>
                                <td className="py-4 px-6 text-sm text-gray-800">
                                    {report.reportable && report.reportable_type === 'App\\Models\\Comment' && ('Comment')}
                                    {report.reportable && report.reportable_type === 'App\\Models\\Post' && ('Post')}
                                    {report.reportable && report.reportable_type === 'App\\Models\\User' && ('User')  }
                                </td>
                                <td className="py-4 px-6 text-sm text-gray-800">
                                    {report.reportable ? report.reportable.id : "N/A"}
                                </td>
                                <td className="py-4 px-6 text-sm text-gray-800">
                                    {report.reported_by_user? report.reported_by_user.name : "N/A"}
                                </td>
                                <td className="py-4 px-6 text-sm text-gray-800">{report.reason}</td>
                                <td className="py-4 px-6">
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleInvestigate(report)}
                                            className="bg-orange-500 text-white px-3 py-1 rounded-md text-sm shadow hover:bg-green-600"
                                        >
                                            Investigate
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
}
