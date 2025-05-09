<?php

use App\Http\Controllers\Api\AttachmentController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ProjectController;
use App\Http\Controllers\Api\SubTaskController;
use App\Http\Controllers\Api\TaskController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/',function(){
    return response()->json('ok');
});
Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);
});
Route::middleware('auth:sanctum')->prefix('projects')->group(function () {
    // Liste des projets
    Route::get('/', [ProjectController::class, 'index']);

    // Détail d’un projet
    Route::get('/{id}', [ProjectController::class, 'show']);

    // Création d’un projet
    Route::post('/', [ProjectController::class, 'store']);

    // Mise à jour d’un projet
    Route::put('/{id}', [ProjectController::class, 'update']);

    // Suppression d’un projet
    Route::delete('/{id}', [ProjectController::class, 'destroy']);
});
Route::middleware('auth:sanctum')->prefix('tasks')->group(function () {
    Route::get('/', [TaskController::class, 'index']);
    Route::post('/', [TaskController::class, 'store']);
    Route::get('/{id}', [TaskController::class, 'show']);
    Route::put('/{id}', [TaskController::class, 'update']);
    Route::delete('/{id}', [TaskController::class, 'destroy']);
    Route::put('/{id}/status', [TaskController::class, 'changeStatus']);
    Route::put('/{id}/kanban', [TaskController::class, 'updateKanban']);
});
Route::middleware('auth:sanctum')->get('/projects/{projectId}/kanban', [TaskController::class, 'kanbanByProject']);
Route::middleware('auth:sanctum')->prefix('subtasks')->group(function () {
    Route::get('/', [SubTaskController::class, 'index']);
    Route::post('/', [SubTaskController::class, 'store']);
    Route::get('/{id}', [SubTaskController::class, 'show']);
    Route::put('/{id}', [SubTaskController::class, 'update']);
    Route::delete('/{id}', [SubTaskController::class, 'destroy']);
    Route::put('/{id}/status', [SubTaskController::class, 'changeStatus']);
});
Route::prefix('attachments')->middleware('auth:api')->group(function () {
    // Upload base64 file
    Route::post('/upload', [AttachmentController::class, 'upload']);

    // Liste des fichiers liés à une tâche
    Route::get('/task/{taskId}', [AttachmentController::class, 'listByTask']);

    // Liste des fichiers liés à une sous-tâche
    Route::get('/sub-task/{subTaskId}', [AttachmentController::class, 'listBySubTask']);

    // Suppression d’un fichier
    Route::delete('/{attachment}', [AttachmentController::class, 'destroy']);
});
