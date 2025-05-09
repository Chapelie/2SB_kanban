<?php
namespace App\Repositories;
use App\Models\Task;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\DB;

class TaskRepository
{
    public function all(): Collection
    {
        return Task::with(['assignedTo', 'project'])->latest()->get();
    }


    public function find(int $id): ?Task
    {
        return Task::with(['assignedTo', 'project', 'subtasks', 'comments'])->find($id);
    }

    public function create(array $data): Task
    {
        return Task::create($data);
    }

    public function update(Task $task, array $data): Task
    {
        $task->update($data);
        return $task->fresh();
    }

    public function delete(Task $task): void
    {
        $task->delete();
    }

    public function filter(array $filters): Collection
    {
        return Task::when(isset($filters['status']), fn($q) => $q->where('status', $filters['status']))
            ->when(isset($filters['priority']), fn($q) => $q->where('priority', $filters['priority']))
            ->when(isset($filters['assigned_to']), fn($q) => $q->where('assigned_to', $filters['assigned_to']))
            ->when(isset($filters['project_id']), fn($q) => $q->where('project_id', $filters['project_id']))
            ->get();
    }

    public function getKanbanBoard(int $projectId): array
    {
        return [
            'backlog' => Task::where('project_id', $projectId)->where('kanban_status', 'backlog')->get(),
            'in_progress' => Task::where('project_id', $projectId)->where('kanban_status', 'in-progress')->get(),
            'completed' => Task::where('project_id', $projectId)->where('kanban_status', 'completed')->get(),
        ];
    }
}
