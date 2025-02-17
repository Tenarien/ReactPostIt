<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
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
        'status',
    ];

    protected function serializeDate(\DateTimeInterface $date)
    {
        return $date->format('Y-m-d H:i:s');
    }

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
        return $this->hasMany(Comment::class, 'parent_id')->with(['user', 'replies', 'likes']);
    }

    public function likes(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'likes', 'comment_id', 'user_id');
    }

    public function reports()
    {
        return $this->morphMany(Report::class, 'reportable');
    }

    public static function getCommentsForPost($post)
    {
        return self::where('post_id', $post->id)
            ->whereNull('parent_id')
            ->with('user', 'replies')
            ->get();
    }

    public static function getCommentsForPostPaginated($post)
    {
        return self::where('post_id', $post->id)
            ->whereNull('parent_id')
            ->with('user', 'replies', 'likes')
            ->paginate(10);
    }

    public static function getComment($comment)
    {
        return self::where('id', $comment->id)
            ->first();
    }

    // Accessor to return "[deleted]" for deleted comments
    public function getBodyAttribute($value)
    {
        return $this->status === 'deleted' ? '[deleted]' : $value;
    }
}
