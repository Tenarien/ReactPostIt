<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class Notifications implements ShouldBroadcast
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
            'type' => $this->notification->type,
            'data' => json_decode($this->notification->data),
            'is_read' => $this->notification->is_read,
            'notifiable_id' => $this->notification->notifiable_id,
            'notifiable_type' => $this->notification->notifiable_type,
        ];
    }
}
