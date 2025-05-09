<?php
namespace App\Services;

use App\Models\Sub_task;
use App\Repositories\SubTaskRepository;
use Illuminate\Support\Facades\Auth;

class SubTaskService
{
    protected SubTaskRepository $repo;

    public function __construct(SubTaskRepository $repo)
    {
        $this->repo = $repo;
    }

    public function listAll()
    {
        return $this->repo->all();
    }

    public function findById(int $id): ?Sub_task
    {
        return $this->repo->find($id);
    }

    public function create(array $data): Sub_task
    {
        return $this->repo->create($data);
    }

    public function update(Sub_task $subtask, array $data): Sub_task
    {
        return $this->repo->update($subtask, $data);
    }

    public function delete(Sub_task $subtask): void
    {
        $this->repo->delete($subtask);
    }

    public function filter(array $filters)
    {
        return $this->repo->filter($filters);
    }

    public function byParentTask(int $taskId)
    {
        return $this->repo->byTask($taskId);
    }

    public function assign(Sub_task $subtask, int $userId): Sub_task
    {
        return $this->repo->update($subtask, ['assigned_to' => $userId]);
    }

    public function changeStatus(Sub_task $subtask, string $status): Sub_task
    {
        return $this->repo->update($subtask, ['status' => $status]);
    }
}
