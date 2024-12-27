<?php

namespace App\Http\Controllers;

use App\Models\Comment;
use App\Models\Post;
use App\Models\Report;
use App\Models\User;
use Illuminate\Http\Request;

class ReportController
{
    public function store(Request $request)
    {
        try {
            $validatedData = $request->validate([
                'reason' => ['required', 'string', 'max:255'],
                'comment_id' => ['nullable', 'integer', 'exists:comments,id'],
                'post_id' => ['nullable', 'integer', 'exists:posts,id'],
                'user_id' => ['nullable', 'integer', 'exists:users,id'],
            ]);

            $ids = array_filter([
                'comment_id' => $validatedData['comment_id'] ?? null,
                'post_id' => $validatedData['post_id'] ?? null,
                'user_id' => $validatedData['user_id'] ?? null,
            ]);

            if (count($ids) !== 1) {
                return redirect()->back()->with(['error' => 'You must report exactly one entity (comment, post, or user).']);
            }

            $reportable_type = null;
            $reportable_id = null;

            if (isset($validatedData['comment_id'])) {
                $reportable_type = Comment::class;
                $reportable_id = $validatedData['comment_id'];
            } elseif (isset($validatedData['post_id'])) {
                $reportable_type = Post::class;
                $reportable_id = $validatedData['post_id'];
            } elseif (isset($validatedData['user_id'])) {
                $reportable_type = User::class;
                $reportable_id = $validatedData['user_id'];
            }

            // Check if the user has already reported this entity
            $alreadyReported = Report::where('reported_by', auth()->id())
                ->where('reportable_id', $reportable_id)
                ->where('reportable_type', $reportable_type)
                ->exists();

            if ($alreadyReported) {
                return redirect()->back()->with('error', 'You have already reported this.');
            }

            Report::create([
                'reported_by' => auth()->id(),
                'reason' => $validatedData['reason'],
                'reportable_id' => $reportable_id,
                'reportable_type' => $reportable_type,
            ]);

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

                    // Delete the associated reportable entity
                    switch ($report->reportable_type) {
                        case Post::class:
                            $post = Post::find($report->reportable_id);
                            if ($post) {
                                $post->delete();
                            }
                            break;

                        case Comment::class:
                            $comment = Comment::find($report->reportable_id);
                            if ($comment) {
                                $comment->delete();
                            }
                            break;

                        case User::class:
                            $user = User::find($report->reportable_id);
                            if ($user) {
                                $user->delete();
                            }
                            break;

                        default:
                            return redirect()->back()->with('error', 'Unknown reportable type.');
                    }

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
}
