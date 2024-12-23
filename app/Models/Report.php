<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\MorphTo;

class Report extends Model
{
    use HasFactory;

    protected $table = 'reports';

    protected $fillable = [
        'reported_by',
        'reason',
        'reportable_id',
        'reportable_type',
        'resolved_at',
    ];

    public function reportable() :MorphTo
    {
        return $this->morphTo();
    }

    public function user() :BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
