<?php

namespace App\Http\Controllers;

use App\Models\User;

class UserController
{
    public function index()
    {
        $user = User::where('id', auth()->id())->firstOrFail();

        return inertia('Profile', ['user' => $user]);
    }

    public function show(User $user)
    {
        return inertia('Profile', ['user' => $user]);
    }

}
