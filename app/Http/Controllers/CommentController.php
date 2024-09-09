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
                'post_id' => ['required', 'exists:posts,id'],
                'body' => ['required', 'max:255', 'string']
            ]);

            Comment::create([
                'post_id' => $validatedData['post_id'],
                'body' => $validatedData['body']
            ]);
            return back()->with('success', 'Comment created successfully!');
        } catch (\Illuminate\Validation\ValidationException $e) {
            return redirect()->back()->withErrors($e->errors())->with('error', 'Comment creation failed!');
        }
    }
}
