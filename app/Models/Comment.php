<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Comment extends Model
{
    use HasFactory;

    protected $table = 'comments';
    protected $fillable = [
        'id',
        'post_id',
        'user_id',
        'parent_id',
        'body',
    ];

    public function post() :BelongsTo
    {
        return $this->belongsTo(Post::class);
    }

    public function user() :BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function parent(): BelongsTo
    {
        return $this->belongsTo(Comment::class, 'parent_id');
    }

    public function replies(): HasMany
    {
        return $this->hasMany(Comment::class, 'parent_id')->with('replies');
    }

    public static function getReplies($postId)
    {
        return self::where('post_id', $postId)
            ->whereNotNull('parent_id')
            ->with('replies')
            ->get();
    }

    public static function getParentComments($postId)
    {
        return self::where('post_id', $postId)
            ->whereNull('parent_id')
            ->with('replies')
            ->get();
    }
}
