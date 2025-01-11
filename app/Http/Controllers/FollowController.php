<?php

namespace App\Http\Controllers;

use App\Events\Notifications;
use App\Models\Follow;
use App\Models\Notification;
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

            if($followed->id !== $validatedData['user_id']) {
                $notification = Notification::create([
                    'type' => 'like',
                    'user_id' => $followed->id,
                    'triggered_by_user_id' => $follower->id,
                    'notifiable_id' => $follower->id,
                    'notifiable_type' => User::class,
                    'data' => json_encode(
                        [
                            'message' => "{$follower->name} followed you!"
                        ]),
                    'is_read' => false,
                ]);

                event(new Notifications($notification));
            }

            return back()->with('success', 'Followed User successfully!');
        } catch (\Exception $e) {
            return back()->with('error', 'Something went wrong. Please try again.');
        }
    }
}
