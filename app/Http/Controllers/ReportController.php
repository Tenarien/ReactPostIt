<?php

namespace App\Http\Controllers;

use App\Models\Comment;
use App\Models\Post;
use App\Models\Report;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\RateLimiter;

class ReportController
{
    public function store(Request $request)
    {
        $key = 'report-create-' . auth()->id();

        if (RateLimiter::tooManyAttempts($key, 5)) {
            return redirect()->back()->with('error', 'You are submitting reports too quickly. Please wait.');
        }

        RateLimiter::hit($key, 60);

        try {
            $validatedData = $request->validate([
                'reason' => ['required', 'string', 'max:255'],
                'reportable_id' => ['required', 'integer'],
                'reportable_type' => ['required', 'in:Post,Comment,User'],
            ]);

            $reportableTypeMap = [
                'Post' => Post::class,
                'Comment' => Comment::class,
                'User' => User::class,
            ];

            $reportableType = $reportableTypeMap[$validatedData['reportable_type']] ?? null;

            if (!$reportableType) {
                return redirect()->back()->with('error', 'Invalid reportable entity.');
            }

            $reportableEntity = $reportableType::where('id', $validatedData['reportable_id'])->first();

            if (!$reportableEntity || ($reportableEntity->status ?? null) === 'deleted') {
                return redirect()->back()->with('error', 'The item you are trying to report does not exist or has been removed.');
            }

            // Check if the user has already reported this entity
            $alreadyReported = Report::where('reported_by', auth()->id())
                ->where('reportable_id', $validatedData['reportable_id'])
                ->where('reportable_type', $reportableType)
                ->exists();

            if ($alreadyReported) {
                return redirect()->back()->with('error', 'You have already reported this.');
            }

            DB::transaction(function () use ($validatedData, $reportableType) {
                Report::create([
                    'reported_by' => auth()->id(),
                    'reason' => $validatedData['reason'],
                    'reportable_id' => $validatedData['reportable_id'],
                    'reportable_type' => $reportableType,
                ]);
            });

            return redirect()->back()->with('success', 'Report created successfully!');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Failed to create a Report.');
        }
    }

    public function investigate($reportId)
    {
        $report = Report::findOrFail($reportId);

        $relatedData = null;

        switch ($report->reportable_type) {
            case Post::class:
                $relatedData = Post::find($report->reportable_id);
                break;
            case Comment::class:
                $relatedData = Comment::find($report->reportable_id);
                break;
            case User::class:
                $relatedData = User::find($report->reportable_id);
                break;
        }

        return inertia('Admin/Investigate', [
            'report' => $report,
            'relatedData' => $relatedData,
        ]);
    }

    public function handleReport(Report $report, $action)
    {
        try {
            $message = '';

            switch ($action) {
                case 'resolve':
                    $report->update(['status' => 'resolved']);
                    $message = 'Report resolved successfully!';
                    break;

                case 'ignore':
                    $report->update(['status' => 'ignored']);
                    $message = 'Report ignored successfully!';
                    break;

                case 'delete':
                    $report->update(['status' => 'deleted']);

                    // Handle deletion of the associated reportable entity
                    $this->deleteReportableEntity($report);
                    $message = 'Report marked as deleted, and associated content removed successfully!';
                    break;

                default:
                    return redirect()->back()->with('error', 'Invalid action.');
            }

            return redirect('/admin')->with('success', $message);
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Failed to perform the action.');
        }
    }

    protected function deleteReportableEntity(Report $report)
    {
        switch ($report->reportable_type) {
            case Post::class:
                $post = Post::find($report->reportable_id);
                if ($post) {
                    $post->update(['status' => 'deleted']);
                }
                break;

            case Comment::class:
                $comment = Comment::find($report->reportable_id);
                if ($comment) {
                    $comment->update(['status' => 'deleted']);
                }
                break;

            case User::class:
                $user = User::find($report->reportable_id);
                if ($user) {
                    $user->delete();
                }
                break;

            default:
                throw new \Exception('Unknown reportable type.');
        }
    }
}
