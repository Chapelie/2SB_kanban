<?php
namespace App\Repositories;
use App\Models\Attachment;
use Illuminate\Database\Eloquent\Collection;
class AttachmentRepository {
    public function find(int $id): ?Attachment
    {
        return Attachment::find($id);
    }
    public function listByTask(int $taskId): Collection
    {
        return Attachment::where('task_id', $taskId)->get();
    }
    public function listBySubTask(int $subTaskId): Collection
    {
        return Attachment::where('sub_task_id', $subTaskId)->get();
    }
    public function create(array $data): Attachment
    {
        return Attachment::create($data);
    }
    public function delete(Attachment $attachment): void
    {
        $attachment->delete();
    }
}
