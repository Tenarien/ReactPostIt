<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class Notifications implements ShouldBroadcastNow
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $notification;

    /**
     * Create a new event instance.
     */
    public function __construct($notification)
    {
        $this->notification = $notification;
    }


    public function broadcastOn()
    {
        return new PrivateChannel('user.notifications.' . $this->notification->user_id);
    }

    public function broadcastWith()
    {
        return [
            'id' => $this->notification->id,
            'type' => $this->notification->type,
            'user_id' => $this->notification->user_id,
            'triggered_by_user_id' => $this->notification->triggered_by_user_id,
            'notifiable_id' => $this->notification->notifiable_id,
            'notifiable_type' => $this->notification->notifiable_type,
            'data' => json_decode($this->notification->data, true),
            'created_at' => $this->notification->created_at->toIso8601String(),
            'updated_at' => $this->notification->updated_at->toIso8601String(),
        ];
    }
}
