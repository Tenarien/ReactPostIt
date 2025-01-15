<?php

namespace App\Http\Controllers;

use App\Events\Notifications;
use App\Models\Comment;
use App\Models\Notification;
use App\Models\Post;
use App\Models\User;
use Illuminate\Http\Request;

class PostController
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $user = auth()->user();
        $request->validate([
            'following' => ['boolean']
        ]);

        $following = $request->input('following', false);

        if($following && auth()->check()){
            $followedUsers = $user->following()->pluck('users.id');
            $posts = Post::latest()->whereIn('user_id', $followedUsers)->with(['user', 'likes'])->paginate(10);
        } else {
            $posts = Post::latest()->with(['user', 'likes'])->paginate(10);
        }



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

            $post = Post::create($validatedData);
            $user = auth()->user();

            $followers = $user->followers;


            foreach ($followers as $follower) {
                $notification = Notification::create([
                    'type' => 'post_created',
                    'user_id' => $follower->id,
                    'triggered_by_user_id' => $user->id,
                    'notifiable_id' => $post->id,
                    'notifiable_type' => Post::class,
                    'data' => json_encode([
                        'message' => "{$user->name} has created a new post!",
                    ]),
                    'is_read' => false,
                ]);

                event(new Notifications($notification));
            }

            return redirect('/')->with('success', 'Post created!');
        } catch (\Illuminate\Validation\ValidationException $e) {
            return redirect()->back()->withErrors($e->errors())->with('error', 'Post creation failed!');
        }


    }

    /**
     * Display the specified resource.
     */
    public function show(Request $request, Post $post)
    {
        $post->load([
            'user',
            'likes',
        ]);

        // Paginate comments and their relationships
        $comments = Comment::getCommentsForPostPaginated($post);

        $highlightedComment = null;
        if($request) {
            $highlightedComment = Comment::where('id', $request->query('comment'))
                ->with('user', 'replies', 'likes')
                ->first();
            if($highlightedComment) {
                $highlightedComment->setAttribute('highlighted', true);
            }
        }


        return inertia('Show', [
            'post' => $post,
            'comments' => $comments,
            'highlightedComment' => $highlightedComment,
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

    public function like(Request $request, Post $post)
    {
        try {
            $userId = auth()->id();
            $user = User::find($request['user_id']);

            if ($post->likes()->where('user_id', $userId)->exists()) {
                $post->likes()->detach($userId);
                return back()->with('success', 'You disliked this post!');
            }

            $post->likes()->attach($userId);

            if($userId !== $post->user->id) {
                $notification = Notification::create([
                    'type' => 'like',
                    'user_id' => $post->user->id,
                    'triggered_by_user_id' => $userId,
                    'notifiable_id' => $post->id,
                    'notifiable_type' => Post::class,
                    'data' => json_encode(
                        [
                            'message' => "{$user->name} liked your post!"
                        ]),
                    'is_read' => false,
                ]);

                event(new Notifications($notification));
            }

            return back()->with('success', 'Liked successfully!');
        } catch (\Illuminate\Validation\ValidationException $e) {
            return back()->withErrors($e->errors())->with('error', 'Liking failed!');
        }
    }
}
