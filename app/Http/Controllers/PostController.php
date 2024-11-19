<?php

namespace App\Http\Controllers;

use App\Models\Comment;
use App\Models\Post;
use Illuminate\Http\Request;

class PostController
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $posts = Post::latest()->with(['user', 'likes'])->paginate(10);

        return inertia('Home', [
            'posts' => $posts,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return inertia('Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        try {
            $validatedData = $request->validate([
                'body' => ['required', 'string', 'max:255', 'min:10'],
                'user_id' => ['required', 'integer', 'exists:users,id'],
            ]);

            Post::create($validatedData);

            return redirect('/')->with('success', 'Post created!');
        } catch (\Illuminate\Validation\ValidationException $e) {
            return redirect()->back()->withErrors($e->errors())->with('error', 'Post creation failed!');
        }


    }

    /**
     * Display the specified resource.
     */
    public function show(Post $post)
    {
        $post->load([
            'user',
            'likes',
        ]);

        // Paginate comments and their relationships
        $comments = Comment::getCommentsForPostPaginated($post);

        return inertia('Show', [
            'post' => $post,
            'comments' => $comments,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Post $post)
    {
        return inertia('Edit', ['post' => $post]);

    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Post $post)
    {
        $userId = $request->input('user_id');
        try {
            $validatedData = $request->validate([
                'body' => ['required', 'max:255', 'min:10']
            ]);

            if(auth()->id() && $post->user->id == $userId){
                $post->update($validatedData);
                return back()->with('success', 'Post updated successfully.');
            }

            return back()->with('error', 'Post update failed!');
        } catch (\Illuminate\Validation\ValidationException $e) {
            return back()->withErrors($e->errors())->with('error', 'Post update failed!');
        }

    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Post $post, Request $request)
    {
        $userId = $request->get('user_id');
        if ($post->user->id == $userId) {
            $post->delete();

            return redirect('/')->with('success', 'Post deleted!');
        }

        return redirect('/')->with('error', 'There was an error deleting the post!');
    }

    public function like(Post $post)
    {
        try {
            $userId = auth()->id();

            if ($post->likes()->where('user_id', $userId)->exists()) {
                $post->likes()->detach($userId);
                return back()->with('success', 'You disliked this post!');
            }

            $post->likes()->attach($userId);

            return back()->with('success', 'Liked successfully!');
        } catch (\Illuminate\Validation\ValidationException $e) {
            return back()->withErrors($e->errors())->with('error', 'Liking failed!');
        }
    }
}
