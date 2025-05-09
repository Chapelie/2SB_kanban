<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Services\TaskServices;
use App\Models\Task;

/** * @OA\Tag( * name="Tasks", * description="API de gestion des tâches" * ) */
class TaskController extends Controller
{
    protected TaskServices $taskService;

    public function __construct(TaskServices $taskService)
    {
        $this->middleware('auth:sanctum');
        $this->taskService = $taskService;
    }

    /** * @OA\Get( * path="/api/tasks", * summary="Lister les tâches (avec filtres)", * tags={"Tasks"}, * @OA\Parameter(name="status", in="query", @OA\Schema(type="string")), * @OA\Parameter(name="priority", in="query", @OA\Schema(type="string")), * @OA\Parameter(name="assigned_to", in="query", @OA\Schema(type="integer")), * @OA\Parameter(name="project_id", in="query", @OA\Schema(type="integer")), * @OA\Response(response=200, description="Liste des tâches") * ) */
    public function index(Request $request)
    {
        return response()->json($this->taskService->filter($request->only(['status', 'priority', 'assigned_to', 'project_id'])));
    }

    /** * @OA\Get( * path="/api/tasks/{id}", * summary="Afficher une tâche", * tags={"Tasks"}, * @OA\Parameter(name="id", in="path", required=true, @OA\Schema(type="integer")), * @OA\Response(response=200, description="Tâche affichée"), * @OA\Response(response=404, description="Tâche non trouvée") * ) */
    public function show($id)
    {
        $task = $this->taskService->findById($id);
        return $task ? response()->json($task) : response()->json(['message' => 'Not found'], 404);
    }

    /** * @OA\Post( * path="/api/tasks", * summary="Créer une tâche", * tags={"Tasks"}, * @OA\RequestBody( * required=true, * @OA\JsonContent( * required={"title", "project_id"}, * @OA\Property(property="title", type="string"), * @OA\Property(property="description", type="string"), * @OA\Property(property="priority", type="string"), * @OA\Property(property="assigned_to", type="integer"), * @OA\Property(property="project_id", type="integer"), * @OA\Property(property="kanban_status", type="string") * ) * ), * @OA\Response(response=201, description="Tâche créée") * ) */
    public function store(Request $request)
    {
        $data = $request->validate(['title' => 'required|string', 'description' => 'nullable|string', 'priority' => 'in:low,medium,high', 'assigned_to' => 'nullable|exists:users,id', 'project_id' => 'required|exists:projects,id', 'kanban_status' => 'nullable|in:backlog,in-progress,completed']);
        $task = $this->taskService->create($data);
        return response()->json($task, 201);
    }

    /** * @OA\Put( * path="/api/tasks/{id}", * summary="Mettre à jour une tâche", * tags={"Tasks"}, * @OA\Parameter(name="id", in="path", required=true, @OA\Schema(type="integer")), * @OA\RequestBody( * required=true, * @OA\JsonContent( * @OA\Property(property="title", type="string"), * @OA\Property(property="description", type="string"), * @OA\Property(property="priority", type="string"), * @OA\Property(property="assigned_to", type="integer"), * @OA\Property(property="status", type="string"), * @OA\Property(property="kanban_status", type="string") * ) * ), * @OA\Response(response=200, description="Tâche mise à jour") * ) */
    public function update(Request $request, Task $task)
    {
        $data = $request->validate(['title' => 'sometimes|string', 'description' => 'nullable|string', 'priority' => 'nullable|in:low,medium,high', 'assigned_to' => 'nullable|exists:users,id', 'status' => 'nullable|in:Open,InProgress,Completed,Canceled', 'kanban_status' => 'nullable|in:backlog,in-progress,completed']);
        return response()->json($this->taskService->update($task, $data));
    }

    /** * @OA\Delete( * path="/api/tasks/{id}", * summary="Supprimer une tâche", * tags={"Tasks"}, * @OA\Parameter(name="id", in="path", required=true, @OA\Schema(type="integer")), * @OA\Response(response=204, description="Tâche supprimée") * ) */
    public function destroy(Task $task)
    {
        $this->taskService->delete($task);
        return response()->json(null, 204);
    }

    /** * @OA\Put( * path="/api/tasks/{id}/status", * summary="Changer le statut d'une tâche", * tags={"Tasks"}, * @OA\RequestBody( * required=true, * @OA\JsonContent( * required={"status"}, * @OA\Property(property="status", type="string") * ) * ), * @OA\Response(response=200, description="Statut modifié") * ) */
    public function changeStatus(Request $request, Task $task)
    {
        $request->validate(['status' => 'required|in:Open,InProgress,Completed,Canceled']);
        return response()->json($this->taskService->changeStatus($task, $request->status));
    }

    /** * @OA\Put( * path="/api/tasks/{id}/kanban", * summary="Déplacer une tâche dans le tableau Kanban", * tags={"Tasks"}, * @OA\RequestBody( * required=true, * @OA\JsonContent( * required={"kanban_status"}, * @OA\Property(property="kanban_status", type="string") * ) * ), * @OA\Response(response=200, description="Colonne mise à jour") * ) */
    public function updateKanban(Request $request, Task $task)
    {
        $request->validate(['kanban_status' => 'required|in:backlog,in-progress,completed']);
        return response()->json($this->taskService->changeKanbanPosition($task, $request->kanban_status));
    }

    /** * @OA\Get( * path="/api/projects/{projectId}/kanban", * summary="Afficher le tableau Kanban d'un projet", * tags={"Tasks"}, * @OA\Parameter(name="projectId", in="path", required=true, @OA\Schema(type="integer")), * @OA\Response(response=200, description="Colonnes Kanban du projet") * ) */
    public function kanbanByProject($projectId)
    {
        return response()->json($this->taskService->getKanbanBoard($projectId));
    }
}
