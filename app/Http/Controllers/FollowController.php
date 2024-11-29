<?php

namespace App\Http\Controllers;

use App\Models\Follow;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class FollowController
{
    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'user_id' => ['required', 'integer', 'exists:users,id'],
        ]);

        $follower = auth()->user();
        $followed = User::findOrFail($validatedData['user_id']);

        if ($follower->id === $followed->id) {
            return redirect()->back()->with('error', 'You cannot follow yourself.');
        }

        if ($follower->following()->where('followed_id', $followed->id)->exists()) {
            $follower->following()->detach($followed->id);
            return redirect()->back()->with('success', 'Unfollowed User successfully!');
        }

        try {
            $follower->following()->attach($followed->id);
            return back()->with('success', 'Followed User successfully!');
        } catch (\Exception $e) {
            return back()->with('error', 'Something went wrong. Please try again.');
        }
    }
}
