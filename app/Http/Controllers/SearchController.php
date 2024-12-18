<?php

namespace App\Http\Controllers;

use App\Models\Post;
use App\Models\User;
use Illuminate\Http\Request;

class SearchController
{
    public function search(Request $request)
    {
        $query = $request->input('query');

        $posts = Post::where('body', 'like', "%{$query}%")
            ->take(5)
            ->get();

        $users = User::where('name', 'like', "%{$query}%")
            ->take(5)
            ->get();

        return response()->json([
            'posts' => $posts,
            'users' => $users,
        ]);
    }
}
