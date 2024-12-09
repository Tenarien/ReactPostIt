<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Notification extends Model
{
    use HasFactory;

    protected $fillable = [
        'type',
        'user_id',
        'triggered_by_user_id',
        'notifiable_id',
        'notifiable_type',
        'data',
        'is_read',
    ];

    public function notifiable()
    {
        return $this->morphTo();
    }

    public function triggeredBy()
    {
        return $this->belongsTo(User::class, 'triggered_by_user_id');
    }

    public function recipient()
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}
