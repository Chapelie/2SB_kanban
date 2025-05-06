<?php
namespace App\Repositories;

use App\Models\Project;
use Illuminate\Support\Facades\Auth;

class ProjectRepository
{
    public function getAll()
    {
        $userId = Auth::id();

        return Project::where('created_by', $userId)
            ->orWhereJsonContains('team_members', $userId)
            ->get();
    }

    public function findById($id)
    {
        $userId = Auth::id();

        return Project::where('id', $id)
            ->where(function ($query) use ($userId) {
                $query->where('created_by', $userId)
                    ->orWhereJsonContains('team_members', $userId);
            })
            ->firstOrFail();
    }

    public function create(array $data)
    {
        return Project::create($data);
    }

    public function update(Project $project, array $data)
    {
        // Optionnel : Vérifier que l'utilisateur peut modifier ce projet
        $this->authorizeAccess($project);

        $project->update($data);
        return $project;
    }

    public function delete(Project $project)
    {
        $this->authorizeAccess($project);

        return $project->delete();
    }

    protected function authorizeAccess(Project $project)
    {
        $userId = Auth::id();

        $isAuthorized = $project->created_by === $userId ||
            in_array($userId, $project->team_members ?? []);

        abort_unless($isAuthorized, 403, 'Accès refusé.');
    }
}
