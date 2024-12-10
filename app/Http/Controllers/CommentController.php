<?php

namespace App\Http\Controllers;

use App\Events\Notifications;
use App\Models\Comment;
use App\Models\Notification;
use App\Models\Post;
use Illuminate\Http\Request;

class CommentController
{
    public function store(Request $request)
    {
        try {
            $validatedData = $request->validate([
                'post_id' => ['required', 'integer', 'exists:posts,id'],
                'user_id' => ['required', 'integer', 'exists:users,id'],
                'parent_id' => ['nullable', 'integer', 'exists:comments,id'],
                'body' => ['required', 'max:255', 'min:1', 'string']
            ]);

            $comment = Comment::create($validatedData);
            $comment->load('user', 'replies');
            // Ensure parent_id is included as null if not set
            $comment->parent_id = $comment->parent_id ?? null;

            $post = Post::findOrFail($comment->post_id);

            $recipientId = null;

            if ($comment->parent_id) {
                $parentComment = Comment::findOrFail($comment->parent_id);
                $recipientId = $parentComment->user_id;
            } else {
                $recipientId = $post->user_id;
            }

            if ($recipientId !== $validatedData['user_id']) {
                $notification = Notification::create([
                    'type' => 'comment',
                    'user_id' => $recipientId,
                    'triggered_by_user_id' => $validatedData['user_id'],
                    'notifiable_id' => $post->id,
                    'notifiable_type' => Post::class,
                    'data' => json_encode([
                        'message' => "{$comment->user->name} commented on your " .
                            ($comment->parent_id ? "comment" : "post") . ": {$comment->body}",
                        'comment_id' => $comment->id,
                    ]),
                    'is_read' => false,
                ]);

                event(new Notifications($notification));
            }

            return back()->with([
                'success' => 'Comment created successfully!',
                'comment' => $comment
            ]);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return back()->withErrors($e->errors())->with('error', 'Comment creation failed!');
        }
    }

    public function update(Request $request, Comment $comment)
    {
        $user = auth()->user();
        try {
            $validatedData = $request->validate([
                'body' => ['required', 'max:255', 'min:1']
            ]);

            if(auth()->id() && $comment->user == $user){
                $comment->update($validatedData);
                return back()->with('success', 'Comment updated successfully.');
            }

            return back()->with('error', 'Comment update failed!');
        } catch (\Illuminate\Validation\ValidationException $e) {
            return back()->withErrors($e->errors())->with('error', 'Comment update failed!');
        }

    }

    public function destroy(Comment $comment)
    {
        $user = auth()->user();
        if ($comment->user == $user) {
            $comment->delete();

            return back()->with('success', 'Comment deleted!');
        }

        return back()->with('error', 'There was an error deleting the comment!');
    }

    public function fetchReplies($commentId)
    {
        $replies = Comment::where('parent_id', $commentId)
            ->with('user', 'replies')
            ->get();

        return response()->json($replies);
    }

    public function like(Comment $comment)
    {
        try {
            $userId = auth()->id();
            if ($comment->likes()->where('user_id', $userId)->exists()) {
                $comment->likes()->detach($userId);
                return back()->with('message', 'You disliked this comment!');
            }
            $comment->likes()->attach($userId);

            $user = auth()->user();

            $notification = Notification::create([
                'type' => 'like',
                'user_id' => $comment->user->id,
                'triggered_by_user_id' => $userId,
                'notifiable_id' => $comment->id,
                'notifiable_type' => Comment::class,
                'data' => json_encode(
                    [
                        'message' => "{$user->name} liked your comment!",
                        'post_id' => $comment->post->id
                    ]),
                'is_read' => false,
            ]);

            event(new Notifications($notification));

            return back()->with('success', 'Liked successfully!');
        } catch (\Illuminate\Validation\ValidationException $e) {
            return back()->withErrors($e->errors())->with('error', 'Liking failed!');
        }
    }
}
