<?php

namespace App\Http\Controllers;

use App\Models\Comment;
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

            Comment::create($validatedData);
            return back()->with('success', 'Comment created successfully!');
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
            return back()->with('success', 'Liked successfully!');
        } catch (\Illuminate\Validation\ValidationException $e) {
            return back()->withErrors($e->errors())->with('error', 'Liking failed!');
        }
    }
}
