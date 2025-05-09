<?php
namespace App\Services;

use App\Models\Task;
use App\Repositories\TaskRepository;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;

class TaskServices
{
    protected TaskRepository $taskRepo;

    public function __construct(TaskRepository $taskRepo)
    {
        $this->taskRepo = $taskRepo;
    }

    public function listAll(): \Illuminate\Support\Collection
    {
        return $this->taskRepo->all();
    }

    public function findById(int $id): ?Task
    {
        return $this->taskRepo->find($id);
    }

    public function create(array $data): Task
    {
        $data['opened_date'] = now()->toDateString();
        $data['opened_by'] = Auth::id();
        $data['task_number'] = '#' . str_pad(Task::count() + 1, 6, '0', STR_PAD_LEFT);
        return $this->taskRepo->create($data);
    }

    public function update(Task $task, array $data): Task
    {
        return $this->taskRepo->update($task, $data);
    }

    public function delete(Task $task): void
    {
        $this->taskRepo->delete($task);
    }

    public function assign(Task $task, int $userId): Task
    {
        return $this->taskRepo->update($task, ['assigned_to' => $userId]);
    }

    public function changeStatus(Task $task, string $status): Task
    {
        return $this->taskRepo->update($task, ['status' => $status]);
    }

    public function changeKanbanPosition(Task $task, string $kanbanStatus): Task
    {
        return $this->taskRepo->update($task, ['kanban_status' => $kanbanStatus]);
    }

    public function filter(array $filters)
    {
        return $this->taskRepo->filter($filters);
    }

    public function getKanbanBoard(int $projectId): array
    {
        return $this->taskRepo->getKanbanBoard($projectId);
    }
}
