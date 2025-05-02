import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../models/project.dart';
import '../../controllers/project_controller.dart';

class ProjectSettingsDialog extends StatefulWidget {
  final Project project;

  const ProjectSettingsDialog({
    Key? key,
    required this.project,
  }) : super(key: key);

  @override
  State<ProjectSettingsDialog> createState() => _ProjectSettingsDialogState();
}

class _ProjectSettingsDialogState extends State<ProjectSettingsDialog> {
  late TextEditingController _titleController;
  late TextEditingController _descriptionController;
  late TextEditingController _dueDateController;
  late ProjectStatus _selectedStatus;

  @override
  void initState() {
    super.initState();
    _titleController = TextEditingController(text: widget.project.title);
    _descriptionController = TextEditingController(text: widget.project.description);
    _dueDateController = TextEditingController(text: widget.project.dueDate);
    _selectedStatus = widget.project.status;
  }

  @override
  void dispose() {
    _titleController.dispose();
    _descriptionController.dispose();
    _dueDateController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return AlertDialog(
      title: const Text('Paramètres du projet'),
      content: SingleChildScrollView(
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            TextField(
              controller: _titleController,
              decoration: const InputDecoration(
                labelText: 'Titre du projet',
              ),
            ),
            const SizedBox(height: 16),
            TextField(
              controller: _descriptionController,
              decoration: const InputDecoration(
                labelText: 'Description',
              ),
              maxLines: 3,
            ),
            const SizedBox(height: 16),
            TextField(
              controller: _dueDateController,
              decoration: const InputDecoration(
                labelText: 'Date d\'échéance',
                hintText: 'JJ MMM AAAA (ex: 15 JUN 2025)',
              ),
              onTap: () async {
                // Ici vous pourriez ajouter un sélecteur de date
                // Pour simplifier, on garde un champ de texte direct
              },
            ),
            const SizedBox(height: 16),
            const Text(
              'Statut du projet:',
              style: TextStyle(
                fontWeight: FontWeight.bold,
                fontSize: 14,
              ),
            ),
            const SizedBox(height: 8),
            Wrap(
              spacing: 8,
              children: [
                _buildStatusChip(ProjectStatus.ontrack, 'En cours', Colors.blue),
                _buildStatusChip(ProjectStatus.offtrack, 'En retard', Colors.red),
                _buildStatusChip(ProjectStatus.completed, 'Terminé', Colors.green),
              ],
            ),
            const SizedBox(height: 16),
            const Divider(),
            const SizedBox(height: 16),
            // Zone de danger
            const Text(
              'Zone de danger',
              style: TextStyle(
                fontSize: 16,
                fontWeight: FontWeight.bold,
                color: Colors.red,
              ),
            ),
            const SizedBox(height: 16),
            ElevatedButton.icon(
              onPressed: () => _showDeleteConfirmation(context),
              icon: const Icon(Icons.delete),
              label: const Text('Supprimer ce projet'),
              style: ElevatedButton.styleFrom(
                backgroundColor: Colors.red,
                foregroundColor: Colors.white,
              ),
            ),
          ],
        ),
      ),
      actions: [
        TextButton(
          onPressed: () => Navigator.pop(context),
          child: const Text('Annuler'),
        ),
        ElevatedButton(
          onPressed: _titleController.text.isEmpty
              ? null
              : () {
                  final updatedProject = Project(
                    id: widget.project.id,
                    title: _titleController.text,
                    description: _descriptionController.text,
                    dueDate: _dueDateController.text,
                    status: _selectedStatus,
                    issuesCount: widget.project.issuesCount,
                    teamMembers: widget.project.teamMembers,
                    createdAt: widget.project.createdAt,
                    ownerId: widget.project.ownerId,
                  );
                  
                  context.read<ProjectController>().updateProject(updatedProject);
                  Navigator.pop(context);
                },
          child: const Text('Enregistrer'),
        ),
      ],
    );
  }

  Widget _buildStatusChip(ProjectStatus status, String label, Color color) {
    return ChoiceChip(
      label: Text(
        label,
        style: TextStyle(
          color: _selectedStatus == status ? Colors.white : Colors.black87,
          fontSize: 12,
        ),
      ),
      selected: _selectedStatus == status,
      selectedColor: color,
      backgroundColor: color.withOpacity(0.1),
      onSelected: (selected) {
        if (selected) {
          setState(() {
            _selectedStatus = status;
          });
        }
      },
    );
  }

  void _showDeleteConfirmation(BuildContext context) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Supprimer le projet'),
        content: const Text(
          'Êtes-vous sûr de vouloir supprimer ce projet ? Cette action est irréversible et supprimera également toutes les tâches associées.',
          style: TextStyle(color: Colors.red),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('Annuler'),
          ),
          TextButton(
            onPressed: () {
              Navigator.pop(context); // Fermer la confirmation
              Navigator.pop(context); // Fermer les paramètres
              
              // Supprimer le projet et retourner à la liste des projets
              context.read<ProjectController>().deleteProject(widget.project.id);
              Navigator.pop(context); // Retourner à la liste des projets
            },
            style: TextButton.styleFrom(foregroundColor: Colors.red),
            child: const Text('Supprimer'),
          ),
        ],
      ),
    );
  }
}