<?php

namespace App\Services;

use App\Models\Attachment;
use App\Repositories\AttachmentRepository;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class AttachmentService
{
    protected AttachmentRepository $repo;

    public function __construct(AttachmentRepository $repo)
    {
        $this->repo = $repo;
    }

    public function uploadBase64(array $data): Attachment
    {
        $fileData = $data['file'];

        // Supprimer le prefixe base64
        $decoded = base64_decode(preg_replace('#^data:.*;base64,#', '', $fileData));

        $fileName = Str::random(40);
        $extension = $this->guessExtension($fileData);
        $path = "attachments/{$fileName}.{$extension}";

        Storage::disk('public')->put($path, $decoded);

        return $this->repo->create([
            'name' => $data['name'] ?? $fileName,
            'size' => strlen($decoded),
            'type' => $data['type'] ?? 'application/octet-stream',
            'url' => Storage::url($path),
            'uploaded_by' => auth()->id(),
            'task_id' => $data['task_id'] ?? null,
            'sub_task_id' => $data['sub_task_id'] ?? null,
            'uploaded_at' => now(),
        ]);
    }

    public function guessExtension(string $base64): string
    {
        return match (true) {
            str_starts_with($base64, 'data:image/jpeg') => 'jpg',
            str_starts_with($base64, 'data:image/png') => 'png',
            str_starts_with($base64, 'data:application/pdf') => 'pdf',
            default => 'bin',
        };
    }

    public function listByTask(int $taskId)
    {
        return $this->repo->listByTask($taskId);
    }

    public function listBySubTask(int $subTaskId)
    {
        return $this->repo->listBySubTask($subTaskId);
    }

    public function delete(Attachment $attachment): void
    {
        $this->deleteFile($attachment->url);
        $this->repo->delete($attachment);
    }

    protected function deleteFile(string $url): void
    {
        $relativePath = str_replace('/storage/', '', $url);

        if (Storage::disk('public')->exists($relativePath)) {
            Storage::disk('public')->delete($relativePath);
        }
    }
}
