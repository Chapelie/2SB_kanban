<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Sub_task extends Model
{
    protected $fillable = [
        'title',
        'description',
        'status',
        'priority',
        'time_spent',
        'assigned_to',
        'parent_task_id',
        'due_date',
        'comments_count',
        'attachments_count',
    ];

    protected $casts = [
        'due_date' => 'date',
        'time_spent' => 'string',
    ];

    // 🔗 Relations

    public function task()
    {
        return $this->belongsTo(Task::class, 'parent_task_id');
    }

    public function assignedTo()
    {
        return $this->belongsTo(User::class, 'assigned_to');
    }

    public function comments()
    {
        return $this->hasMany(Comment::class);
    }

    public function attachments()
    {
        return $this->hasMany(Attachment::class);
    }

    public function worklogs()
    {
        return $this->hasMany(WorkLog::class);
    }

}
