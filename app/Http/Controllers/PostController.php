<?php

namespace App\Http\Controllers;

use App\Models\Comment;
use App\Models\Post;
use Illuminate\Http\Request;

class PostController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $posts = Post::latest()->with('user')->paginate(5);

        return inertia('Home', ['posts' => $posts]);
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

            return redirect('/')->with('message', 'Post created!');
        } catch (\Illuminate\Validation\ValidationException $e) {
            return redirect()->back()->withErrors($e->errors())->with('error', 'Post creation failed!');
        }


    }

    /**
     * Display the specified resource.
     */
    public function show(Post $post)
    {
        $post->load('user');
        $postLikes = $post->likers;

        $comments = Comment::getCommentsForPost($post);

        $hasLikedPost = $post->likers()->where('user_id', auth()->id())->exists();


        return inertia('Show', [
            'post' => $post,
            'comments' => $comments,
            'postLikes' => $postLikes,
            'hasLikedPost' => $hasLikedPost,
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
        try {
            $validatedData = $request->validate([
                'body' => ['required', 'max:255', 'min:10']
            ]);

            $post->update($validatedData);

            return to_route('post.index')->with('success', 'Post updated successfully.');
        } catch (\Illuminate\Validation\ValidationException $e) {
            return back()->withErrors($e->errors())->with('error', 'Post update failed!');
        }

    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Post $post)
    {
        $post->delete();

        return redirect('/')->with('success', 'Post deleted!');
    }
}
