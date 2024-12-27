<?php

use App\Http\Controllers\AdminController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\CommentController;
use App\Http\Controllers\FollowController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\PostController;
use App\Http\Controllers\ReportController;
use App\Http\Controllers\SearchController;
use App\Http\Controllers\UserController;
use App\Http\Middleware\AdminMiddleware;
use Illuminate\Support\Facades\Route;

Route::get('/', [PostController::class, 'index'])->name('post.index');
Route::resource('posts', PostController::class)->except('index');
Route::get('/post/{post}', [PostController::class, 'show']);
Route::get('/comments/{comment}/likes', [CommentController::class, 'fetchCommentLikes']);

Route::get('/profile/{user}', [UserController::class, 'show']);

Route::get('/search', [SearchController::class, 'search']);


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
    Route::put('/comments/{comment}', [CommentController::class, 'update']);
    Route::delete('/comments/{comment}', [CommentController::class, 'destroy']);

    Route::post('/posts/{post}/like', [PostController::class, 'like']);
    Route::post('/comments/{comment}/like', [CommentController::class, 'like']);

    Route::get('/profile', [UserController::class, 'index']);
    Route::put('/profile/update/{user}', [AuthController::class, 'update']);

    Route::post('/profile/{user}/follow', [FollowController::class, 'store']);

    Route::post('/notifications/mark-all-read', [NotificationController::class, 'markAllAsRead']);

    Route::post('/report', [ReportController::class, 'store']);
});

Route::middleware([AdminMiddleware::class])->prefix('/admin')->group(function () {
    Route::get('/', [AdminController::class, 'index']);

    Route::get('/{report}/investigate', [ReportController::class, 'investigate']);
    Route::post('/{report}/{action}', [ReportController::class, 'handleReport'])->where('action', 'resolve|ignore');
    Route::delete('/{report}/delete', [ReportController::class, 'handleReport'])->defaults('action', 'delete');
});







