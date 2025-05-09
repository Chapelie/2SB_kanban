<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Task extends Model
{
    protected $fillable = [
        'title',
        'task_number',
        'opened_date',
        'opened_by',
        'status',
        'time_spent',
        'priority',
        'description',
        'assigned_to',
        'project_id',
        'comments_count',
        'attachments_count',
        'kanban_status',
    ];

    public function project()
    {
        return $this->belongsTo(Project::class);
    }

    public function openedBy()
    {
        return $this->belongsTo(User::class, 'opened_by');
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

    public function subtasks()
    {
        return $this->hasMany(SubTask::class);
    }

    public function worklogs()
    {
        return $this->hasMany(WorkLog::class);
    }

    // ✅ Accessor : nombre de jours depuis ouverture
    protected function openedDaysAgo(): Attribute
    {
        return Attribute::get(function () {
            return Carbon::parse($this->opened_date)->diffInDays(now());
        });
    }
}
