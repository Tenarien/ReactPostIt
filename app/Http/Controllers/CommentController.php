<?php

namespace App\Http\Controllers;

use App\Models\Comment;
use Illuminate\Http\Request;

class CommentController extends Controller
{
    public function store(Request $request)
    {
        try {
            $validatedData = $request->validate([
                'post_id' => ['required', 'integer', 'exists:posts,id'],
                'user_id' => ['required', 'integer', 'exists:users,id'],
                'parent_id' => ['nullable', 'integer', 'exists:comments,id'],
                'body' => ['required', 'max:255', 'string']
            ]);

            Comment::create($validatedData);
            return back()->with('success', 'Comment created successfully!');
        } catch (\Illuminate\Validation\ValidationException $e) {
            return redirect()->back()->withErrors($e->errors())->with('error', 'Comment creation failed!');
        }
    }

    public function fetchReplies($commentId)
    {
        $replies = Comment::where('parent_id', $commentId)
            ->with('user', 'replies')
            ->get();

        return response()->json($replies);
    }

    public function fetchCommentLikes(Comment $comment)
    {
        $comment = Comment::getComment($comment);

        $hasLikedComment = $comment->likers()->where('user_id', auth()->id())->exists();
        $likesCount = $comment->likers()->count();

        return response()->json([
            'comment_likes_count' => $likesCount,
            'has_liked_comment' => $hasLikedComment,
        ]);
    }

    public function like(Comment $comment)
    {
        try {
            $userId = auth()->id();

            if ($comment->likers()->where('user_id', $userId)->exists()) {
                $comment->likers()->detach($userId);
                return back()->with('message', 'You disliked this comment!');
            }

            $comment->likers()->attach($userId);

            return back()->with('success', 'Liked successfully!');
        } catch (\Illuminate\Validation\ValidationException $e) {
            return back()->withErrors($e->errors())->with('error', 'Liking failed!');
        }
    }
}
