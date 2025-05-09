<?php


namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Attachment;
use App\Services\AttachmentService;
use Illuminate\Http\Request;

/**
 * @OA\Tag(
 *     name="Attachments",
 *     description="Gestion des pièces jointes"
 * )
 */
class AttachmentController extends Controller
{
    protected AttachmentService $service;

    public function __construct(AttachmentService $service)
    {
        $this->service = $service;
    }

    /**
     * @OA\Post(
     *     path="/api/attachments/upload",
     *     summary="Téléverser un fichier encodé en base64",
     *     tags={"Attachments"},
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"file"},
     *             @OA\Property(property="file", type="string", example="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA..."),
     *             @OA\Property(property="name", type="string", example="fichier_test.png"),
     *             @OA\Property(property="type", type="string", example="image/png"),
     *             @OA\Property(property="task_id", type="integer", example=1),
     *             @OA\Property(property="sub_task_id", type="integer", example=2)
     *         )
     *     ),
     *     @OA\Response(
     *         response=201,
     *         description="Fichier téléversé",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="Fichier téléversé avec succès"),
     *             @OA\Property(property="attachment", type="object")
     *         )
     *     )
     * )
     */
    public function upload(Request $request)
    {
        $request->validate([
            'file' => 'required|string',
            'name' => 'nullable|string|max:255',
            'type' => 'nullable|string|max:255',
            'task_id' => 'nullable|integer|exists:tasks,id',
            'sub_task_id' => 'nullable|integer|exists:sub_tasks,id',
        ]);

        $attachment = $this->service->uploadBase64($request->all());

        return response()->json([
            'message' => 'Fichier téléversé avec succès',
            'attachment' => $attachment,
        ], 201);
    }

    /**
     * @OA\Get(
     *     path="/api/attachments/task/{taskId}",
     *     summary="Lister les fichiers d'une tâche",
     *     tags={"Attachments"},
     *     @OA\Parameter(
     *         name="taskId",
     *         in="path",
     *         required=true,
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Liste des pièces jointes"
     *     )
     * )
     */
    public function listByTask($taskId)
    {
        $attachments = $this->service->listByTask($taskId);
        return response()->json($attachments);
    }

    /**
     * @OA\Get(
     *     path="/api/attachments/sub-task/{subTaskId}",
     *     summary="Lister les fichiers d'une sous-tâche",
     *     tags={"Attachments"},
     *     @OA\Parameter(
     *         name="subTaskId",
     *         in="path",
     *         required=true,
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Liste des pièces jointes"
     *     )
     * )
     */
    public function listBySubTask($subTaskId)
    {
        $attachments = $this->service->listBySubTask($subTaskId);
        return response()->json($attachments);
    }

    /**
     * @OA\Delete(
     *     path="/api/attachments/{id}",
     *     summary="Supprimer une pièce jointe",
     *     tags={"Attachments"},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         required=true,
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Fichier supprimé avec succès",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="Fichier supprimé avec succès")
     *         )
     *     )
     * )
     */
    public function destroy(Attachment $attachment)
    {
        $this->service->delete($attachment);
        return response()->json([
            'message' => 'Fichier supprimé avec succès'
        ]);
    }
}

