<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Project;
use App\Services\ProjectService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ProjectController extends Controller
{
    protected $projectService;

    public function __construct(ProjectService $projectService)
    {
        $this->projectService = $projectService;
    }

    /**
     * @OA\Get(
     *     path="/api/projects",
     *     summary="Liste des projets accessibles",
     *     tags={"Projects"},
     *     @OA\Response(response=200, description="Liste des projets")
     * )
     */
    public function index()
    {
        return response()->json($this->projectService->getAllProjects());
    }

    /**
     * @OA\Get(
     *     path="/api/projects/{id}",
     *     summary="Afficher un projet",
     *     tags={"Projects"},
     *     @OA\Parameter(name="id", in="path", required=true, @OA\Schema(type="string")),
     *     @OA\Response(response=200, description="Projet récupéré"),
     *     @OA\Response(response=404, description="Projet non trouvé")
     * )
     */
    public function show($id)
    {
        return response()->json($this->projectService->getProjectById($id));
    }

    /**
     * @OA\Post(
     *     path="/api/projects",
     *     summary="Créer un projet",
     *     tags={"Projects"},
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"title", "description", "dueDate"},
     *             @OA\Property(property="title", type="string"),
     *             @OA\Property(property="description", type="string"),
     *             @OA\Property(property="dueDate", type="string"),
     *             @OA\Property(property="status", type="string"),
     *             @OA\Property(property="team_members", type="array", @OA\Items(type="string"))
     *         )
     *     ),
     *     @OA\Response(response=201, description="Projet créé")
     * )
     */
    public function store(Request $request)
    {
        $data = $request->validate([
            'title' => 'required|string',
            'description' => 'nullable|string',
            'dueDate' => 'nullable|string',
            'status' => 'nullable|string|in:OnTrack,Offtrack,Completed',
            'team_members' => 'nullable|array',
        ]);

        $data['created_by'] = Auth::id();

        $project = $this->projectService->createProject($data);

        return response()->json($project, 201);
    }

    /**
     * @OA\Put(
     *     path="/api/projects/{id}",
     *     summary="Modifier un projet",
     *     tags={"Projects"},
     *     @OA\Parameter(name="id", in="path", required=true, @OA\Schema(type="string")),
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             @OA\Property(property="title", type="string"),
     *             @OA\Property(property="description", type="string"),
     *             @OA\Property(property="dueDate", type="string"),
     *             @OA\Property(property="status", type="string"),
     *             @OA\Property(property="team_members", type="array", @OA\Items(type="string"))
     *         )
     *     ),
     *     @OA\Response(response=200, description="Projet mis à jour")
     * )
     */
    public function update(Request $request, Project $project)
    {
        $data = $request->validate([
            'title' => 'sometimes|string',
            'description' => 'nullable|string',
            'dueDate' => 'nullable|string',
            'status' => 'nullable|string|in:OnTrack,Offtrack,Completed',
            'team_members' => 'nullable|array',
        ]);

        $updatedProject = $this->projectService->updateProject($project, $data);

        return response()->json($updatedProject);
    }

    /**
     * @OA\Delete(
     *     path="/api/projects/{id}",
     *     summary="Supprimer un projet",
     *     tags={"Projects"},
     *     @OA\Parameter(name="id", in="path", required=true, @OA\Schema(type="string")),
     *     @OA\Response(response=204, description="Projet supprimé")
     * )
     */
    public function destroy(Project $project)
    {
        $this->projectService->deleteProject($project);
        return response()->json(null, 204);
    }
}
