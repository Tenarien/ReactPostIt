<?php

namespace App\Http\Controllers;

use App\Models\Report;
use Illuminate\Http\Request;

class AdminController
{
    public function index(Request $request)
    {
        $reports = null;

        if($request->input('status')) {
            switch ($request->input('status')) {
                case 'new':
                    $reports = Report::where('status', 'new')->paginate(10);
                    break;
                case 'ignored':
                    $reports = Report::where('status', 'ignored')->paginate(10);
                    break;
                case 'resolved':
                    $reports = Report::where('status', 'resolved')->paginate(10);
                    break;
                case 'deleted':
                    $reports = Report::where('status', 'deleted')->paginate(10);
                    break;
            }
        } elseif($request->input('reportId')) {
            try {
                $request->validate([
                    'reportId' => ['required', 'integer', 'exists:reports,id'],
                ]);

                $reportId = $request->input('reportId');

                $reports = Report::where('id', $reportId)->paginate(10);
            } catch (\Illuminate\Validation\ValidationException $e) {
                return redirect()
                    ->back()
                    ->withErrors(['error' => 'The Report ID must be a valid number and exist in the database.']);
            }
        } else {
            $reports = Report::where('status', 'new')->paginate(10);
        }

        return inertia('Admin/Admin', ['reports' => $reports]);
    }
}
