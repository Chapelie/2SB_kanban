<?php
namespace App\Services;

use App\Models\Project;
use App\Repositories\ProjectRepository;

class ProjectService
{
    protected $projectRepository;

    public function __construct(ProjectRepository $projectRepository)
    {
        $this->projectRepository = $projectRepository;
    }

    public function getAllProjects()
    {
        return $this->projectRepository->getAll();
    }

    public function getProjectById($id)
    {
        return $this->projectRepository->findById($id);
    }

    public function createProject(array $data)
    {
        return $this->projectRepository->create($data);
    }

    public function updateProject(Project $project, array $data)
    {
        return $this->projectRepository->update($project, $data);
    }

    public function deleteProject(Project $project)
    {
        return $this->projectRepository->delete($project);
    }
}

