<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Attachment extends Model
{
    protected $fillable = [
        'name',
        'size',
        'type',
        'url',
        'uploaded_by',
        'task_id',
        'sub_task_id',
        'uploaded_at',
    ];

    protected $casts = [
        'uploaded_at' => 'datetime',
    ];

    // 🔗 Relations

    public function user()
    {
        return $this->belongsTo(User::class, 'uploaded_by');
    }

    public function task()
    {
        return $this->belongsTo(Task::class);
    }

    public function subTask()
    {
        return $this->belongsTo(SubTask::class);
    }
}
