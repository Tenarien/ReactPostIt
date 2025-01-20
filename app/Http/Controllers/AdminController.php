<?php

namespace App\Http\Controllers;

use App\Models\Report;
use Illuminate\Http\Request;

class AdminController
{
    public function index(Request $request)
    {
        $reportsQuery = Report::query()->with(['reportable', 'reportedByUser']);

        if ($request->input('status')) {
            $status = $request->input('status');
            $reportsQuery->where('status', $status);
        } elseif ($request->input('reportId')) {
            $request->validate([
                'reportId' => ['required', 'integer', 'exists:reports,id'],
            ]);
            $reportId = $request->input('reportId');
            $reportsQuery->where('id', $reportId);
        } else {
            $reportsQuery->where('status', 'new');
        }

        $reports = $reportsQuery->paginate(10);

        return inertia('Admin/Admin', ['reports' => $reports]);
    }
}
