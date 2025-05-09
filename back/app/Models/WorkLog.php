<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class WorkLog extends Model
{
    protected $fillable = [
        'project_id',
        'user_id',
        'task_id',
        'description',
        'date',
        'status',
        'time_spent',
    ];

    protected $casts = [
        'date' => 'date',
        'time_spent' => 'string',
    ];
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function project()
    {
        return $this->belongsTo(Project::class);
    }

    public function task()
    {
        return $this->belongsTo(Task::class);
    }
}
