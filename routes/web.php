<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\CommentController;
use App\Http\Controllers\PostController;
use Illuminate\Support\Facades\Route;

Route::get('/', [PostController::class, 'index'])->name('post.index');
Route::resource('posts', PostController::class)->except('index');
Route::get('/post/{post}', [PostController::class, 'show']);
Route::get('/comments/{comment}/replies', [CommentController::class, 'fetchReplies']);
Route::get('/comments/{comment}/likes', [CommentController::class, 'fetchCommentLikes']);

Route::middleware('guest')->group(function () {
    Route::get('/register', [AuthController::class, 'registerForm'])->name('register.form');
    Route::post('/register', [AuthController::class, 'register'])->name('register');
    Route::post('/login', [AuthController::class, 'login']);
    Route::get('/login', [AuthController::class, 'loginForm'])->name('login');
});

Route::middleware('auth')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);

    Route::get('/posts/create', [PostController::class, 'create']);
    Route::post('/posts/{post}', [PostController::class, 'update']);
    Route::post('/posts/{post}', [PostController::class, 'destroy']);
    Route::post('/posts/{post}', [PostController::class, 'store']);
    Route::post('/posts/{post}/comments', [CommentController::class, 'store']);

    Route::post('/posts/{post}/like', [PostController::class, 'like']);
    Route::post('/comments/{comment}/like', [CommentController::class, 'like']);
});







