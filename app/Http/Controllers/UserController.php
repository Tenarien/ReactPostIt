<?php

namespace App\Http\Controllers;

use App\Models\User;

class UserController
{
    public function index()
    {
        $user = User::where('id', auth()->id())->firstOrFail();

        $posts = $user->posts()->orderBy('created_at', 'desc')->paginate(10);
        $posts->load('user', 'likes');

        $user->load('following', 'followers')
            ->makeVisible('email');

        return inertia('Profile', [
            'user' => $user,
            'posts' => $posts,
        ]);
    }

    public function show(User $user)
    {
        $posts = $user->posts()->orderBy('created_at', 'desc')->paginate(10);
        $posts->load('user', 'likes');

        $user->load('following', 'followers');

        return inertia('Profile', [
            'user' => $user,
            'posts' => $posts,
        ]);
    }

}
