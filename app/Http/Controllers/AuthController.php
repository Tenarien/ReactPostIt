<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $validatedData = $request->validate([
           'email' => ['required', 'string', 'email', 'max:255'],
            'password' => ['required', 'string', 'min:6'],
        ]);

        if (Auth::attempt($validatedData)) {
            $request->session()->regenerate();
            return redirect()->intended('/');
        } else {
            return back()->withErrors([
                'error' => 'These credentials do not match our records.',
            ]);
        }

    }

    public function logout(Request $request)
    {
        Auth::logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect('/posts/4');
    }

    public function registerForm()
    {
        return inertia('Register');
    }

    public function register(Request $request)
    {
        try {
            $validatedData = $request->validate([
                'name' => ['required', 'string', 'max:255', 'unique:users'],
                'email' => ['required', 'string', 'email', 'max:255', 'unique:users'],
                'password' => ['required', 'string', 'min:8', 'confirmed'],
            ]);

            $user = User::create([
                'name' => $validatedData['name'],
                'email' => $validatedData['email'],
                'password' => bcrypt($validatedData['password'])
            ]);

            Auth::login($user);

            return redirect()->intended('/')->with('success', 'You are now logged in!');
        } catch (\Illuminate\Validation\ValidationException $e) {
            return redirect()->back()->withErrors($e->errors())->with('error', 'There was an error, try again.');
        }
    }

}