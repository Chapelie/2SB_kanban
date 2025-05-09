<?php
namespace App\Repositories;

use App\Models\Sub_task;
use Illuminate\Database\Eloquent\Collection;

class SubTaskRepository
{
    public function all(): Collection
    {
        return Sub_task::with(['assignedTo', 'task'])->latest()->get();
    }

    public function find(int $id): ?Sub_task
    {
        return Sub_task::with(['assignedTo', 'comments', 'attachments'])->find($id);
    }

    public function create(array $data): Sub_task
    {
        return Sub_task::create($data);
    }

    public function update(Sub_task $subtask, array $data): Sub_task
    {
        $subtask->update($data);
        return $subtask->fresh();
    }

    public function delete(Sub_task $subtask): void
    {
        $subtask->delete();
    }

    public function byTask(int $taskId): Collection
    {
        return Sub_task::where('parent_task_id', $taskId)->get();
    }

    public function filter(array $filters): Collection
    {
        return Sub_task::query()
            ->when($filters['status'] ?? null, fn($q) => $q->where('status', $filters['status']))
            ->when($filters['priority'] ?? null, fn($q) => $q->where('priority', $filters['priority']))
            ->when($filters['assigned_to'] ?? null, fn($q) => $q->where('assigned_to', $filters['assigned_to']))
            ->when($filters['parent_task_id'] ?? null, fn($q) => $q->where('parent_task_id', $filters['parent_task_id']))
            ->get();
    }
}
