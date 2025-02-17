<?php

namespace App\Http\Controllers;

use App\Models\Notification;
use Illuminate\Http\Request;

class NotificationController
{
    public function index()
    {
        $notifications = Notification::where('user_id', auth()->id())
            ->orderBy('created_at', 'desc')
            ->get();

        return inertia('NotificationsDropdown', [
            'notifications' => $notifications,
        ]);
    }

    public function markAllAsRead()
    {
        $user = auth()->user();
        $user->notifications()
            ->where('is_read', false)
            ->update(['is_read' => true]);
    }
}
