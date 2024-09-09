<?php

use App\Http\Controllers\CommentController;
use App\Http\Controllers\PostController;
use Illuminate\Support\Facades\Route;

Route::get('/', [PostController::class, 'index'])->name('post.index');

Route::resource('posts', PostController::class)->except('index');
Route::post('/posts/{post}/comments', [CommentController::class, 'store']);
