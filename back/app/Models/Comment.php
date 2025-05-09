<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Comment extends Model
{
    protected $fillable = [
        'content',
        'author',
        'task_id',
        'sub_task_id',
    ];

    protected $casts = [
        'created_at' => 'datetime',
    ];

    // 🔗 Relations

    public function user()
    {
        return $this->belongsTo(User::class, 'author');
    }

    public function task()
    {
        return $this->belongsTo(Task::class);
    }

    public function subTask()
    {
        return $this->belongsTo(SubTask::class);
    }

    // 📅 Accessor : date formatée (facultatif)
    public function getFormattedDateAttribute(): string
    {
        return $this->created_at->format('d/m/Y H:i');
    }
}
