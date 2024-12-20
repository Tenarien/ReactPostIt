<?php

namespace App\Http\Controllers;

use App\Models\Report;
use Illuminate\Http\Request;

class ReportController
{
    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'reason' => ['string', 'nullable', 'max:255'],
            'reportable_type' => ['required', 'string'],
            'reportable_id' => ['required', 'integer'],
        ]);

        $validatedData['reported_by'] = auth()->id();

        Report::create($validatedData);

        return redirect()->back()->with('success', 'Report created!');
    }
}
