<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Services\SubTaskService;
use App\Models\Sub_task;

/** * @OA\Tag( * name="SubTasks", * description="Gestion des sous-tâches" * ) */
class SubTaskController extends Controller
{
    protected SubTaskService $subTaskService;

    public function __construct(SubTaskService $subTaskService)
    {
        $this->middleware('auth:sanctum');
        $this->subTaskService = $subTaskService;
    }

    /** * @OA\Get( * path="/api/subtasks", * summary="Lister toutes les sous-tâches avec filtres", * tags={"SubTasks"}, * @OA\Parameter(name="status", in="query", @OA\Schema(type="string")), * @OA\Parameter(name="priority", in="query", @OA\Schema(type="string")), * @OA\Parameter(name="assigned_to", in="query", @OA\Schema(type="integer")), * @OA\Parameter(name="parent_task_id", in="query", @OA\Schema(type="integer")), * @OA\Response(response=200, description="Liste des sous-tâches") * ) */
    public function index(Request $request)
    {
        return response()->json($this->subTaskService->filter($request->only(['status', 'priority', 'assigned_to', 'parent_task_id'])));
    }

    /** * @OA\Get( * path="/api/subtasks/{id}", * summary="Afficher une sous-tâche", * tags={"SubTasks"}, * @OA\Parameter(name="id", in="path", required=true, @OA\Schema(type="integer")), * @OA\Response(response=200, description="Sous-tâche trouvée"), * @OA\Response(response=404, description="Non trouvée") * ) */
    public function show($id)
    {
        $subtask = $this->subTaskService->findById($id);
        return $subtask ? response()->json($subtask) : response()->json(['message' => 'Not found'], 404);
    }

    /** * @OA\Post( * path="/api/subtasks", * summary="Créer une sous-tâche", * tags={"SubTasks"}, * @OA\RequestBody( * required=true, * @OA\JsonContent( * required={"title", "parent_task_id"}, * @OA\Property(property="title", type="string"), * @OA\Property(property="description", type="string"), * @OA\Property(property="priority", type="string"), * @OA\Property(property="assigned_to", type="integer"), * @OA\Property(property="parent_task_id", type="integer"), * @OA\Property(property="due_date", type="string", format="date") * ) * ), * @OA\Response(response=201, description="Sous-tâche créée") * ) */
    public function store(Request $request)
    {
        $data = $request->validate(['title' => 'required|string', 'description' => 'nullable|string', 'priority' => 'in:low,medium,high', 'assigned_to' => 'nullable|exists:users,id', 'parent_task_id' => 'required|exists:tasks,id', 'due_date' => 'nullable|date']);
        return response()->json($this->subTaskService->create($data), 201);
    }

    /** * @OA\Put( * path="/api/subtasks/{id}", * summary="Mettre à jour une sous-tâche", * tags={"SubTasks"}, * @OA\Parameter(name="id", in="path", required=true, @OA\Schema(type="integer")), * @OA\RequestBody( * required=true, * @OA\JsonContent( * @OA\Property(property="title", type="string"), * @OA\Property(property="description", type="string"), * @OA\Property(property="priority", type="string"), * @OA\Property(property="status", type="string"), * @OA\Property(property="assigned_to", type="integer"), * @OA\Property(property="due_date", type="string", format="date") * ) * ), * @OA\Response(response=200, description="Sous-tâche mise à jour") * ) */
    public function update(Request $request, Sub_task $subtask)
    {
        $data = $request->validate(['title' => 'sometimes|string', 'description' => 'nullable|string', 'priority' => 'nullable|in:low,medium,high', 'status' => 'nullable|in:Open,InProgress,Completed', 'assigned_to' => 'nullable|exists:users,id', 'due_date' => 'nullable|date']);
        return response()->json($this->subTaskService->update($subtask, $data));
    }

    /** * @OA\Delete( * path="/api/subtasks/{id}", * summary="Supprimer une sous-tâche", * tags={"SubTasks"}, * @OA\Parameter(name="id", in="path", required=true, @OA\Schema(type="integer")), * @OA\Response(response=204, description="Supprimée avec succès") * ) */
    public function destroy(Sub_task $subtask)
    {
        $this->subTaskService->delete($subtask);
        return response()->json(null, 204);
    }

    /** * @OA\Put( * path="/api/subtasks/{id}/status", * summary="Changer le statut d'une sous-tâche", * tags={"SubTasks"}, * @OA\RequestBody( * required=true, * @OA\JsonContent( * required={"status"}, * @OA\Property(property="status", type="string") * ) * ), * @OA\Response(response=200, description="Statut mis à jour") * ) */
    public function changeStatus(Request $request, Sub_task $subtask)
    {
        $request->validate(['status' => 'required|in:Open,InProgress,Completed']);
        return response()->json($this->subTaskService->changeStatus($subtask, $request->status));
    }
}
