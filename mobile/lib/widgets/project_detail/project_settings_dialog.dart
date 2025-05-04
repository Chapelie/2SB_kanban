import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../controllers/project_controller.dart';
import '../../models/project.dart';

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
  late DateTime? _selectedDate;
  late ProjectStatus _selectedStatus;
  bool _isFavorite = false;
  bool _isLoading = false;

  @override
  void initState() {
    super.initState();
    _titleController = TextEditingController(text: widget.project.title);
    _descriptionController = TextEditingController(text: widget.project.description);
    _selectedStatus = widget.project.status;
    _isFavorite = widget.project.isFavorite ?? false;
    
    // Parsing de la date
    try {
      final parts = widget.project.dueDate.split('/');
      if (parts.length == 3) {
        final day = int.parse(parts[0]);
        final month = int.parse(parts[1]);
        final year = int.parse(parts[2]);
        _selectedDate = DateTime(year, month, day);
      } else {
        _selectedDate = null;
      }
    } catch (e) {
      _selectedDate = null;
    }
  }

  @override
  void dispose() {
    _titleController.dispose();
    _descriptionController.dispose();
    super.dispose();
  }

  void _selectDate(BuildContext context) async {
    final DateTime? pickedDate = await showDatePicker(
      context: context,
      initialDate: _selectedDate ?? DateTime.now(),
      firstDate: DateTime.now().subtract(const Duration(days: 365)),
      lastDate: DateTime.now().add(const Duration(days: 365 * 5)),
      builder: (context, child) {
        return Theme(
          data: Theme.of(context).copyWith(
            colorScheme: ColorScheme.light(
              primary: Theme.of(context).colorScheme.primary,
            ),
          ),
          child: child!,
        );
      },
    );

    if (pickedDate != null && pickedDate != _selectedDate) {
      setState(() {
        _selectedDate = pickedDate;
      });
    }
  }

  String _formatDate(DateTime date) {
    return '${date.day.toString().padLeft(2, '0')}/${date.month.toString().padLeft(2, '0')}/${date.year}';
  }

  void _saveProjectSettings() async {
    if (_titleController.text.trim().isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Le titre du projet ne peut pas être vide'),
          behavior: SnackBarBehavior.floating,
        ),
      );
      return;
    }

    setState(() {
      _isLoading = true;
    });

    try {
      final controller = Provider.of<ProjectController>(context, listen: false);
      final updatedProject = Project(
        id: widget.project.id,
        title: _titleController.text.trim(),
        description: _descriptionController.text.trim(),
        status: _selectedStatus,
        dueDate: _selectedDate != null ? _formatDate(_selectedDate!) : '',
        isFavorite: _isFavorite,
        teamMembers: widget.project.teamMembers,
        createdAt: widget.project.createdAt, 
        ownerId: widget.project.ownerId,
      );

      await controller.updateProject(updatedProject);
      if (mounted) {
        Navigator.pop(context, true);
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Erreur lors de la mise à jour: $e'),
            behavior: SnackBarBehavior.floating,
          ),
        );
        setState(() {
          _isLoading = false;
        });
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final mediaQuery = MediaQuery.of(context);
    final isSmall = mediaQuery.size.width < 600;
    final isVerySmall = mediaQuery.size.width < 400;

    return Dialog(
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(16),
      ),
      child: Container(
        width: isSmall ? double.maxFinite : 600,
        constraints: BoxConstraints(
          maxWidth: 600,
          maxHeight: mediaQuery.size.height * 0.9,
        ),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            // Header
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: theme.colorScheme.primary,
                borderRadius: const BorderRadius.only(
                  topLeft: Radius.circular(16),
                  topRight: Radius.circular(16),
                ),
              ),
              child: Row(
                children: [
                  Icon(
                    Icons.settings,
                    color: Colors.white,
                    size: 24,
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: Text(
                      'Paramètres du projet',
                      style: theme.textTheme.titleLarge?.copyWith(
                        color: Colors.white,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ),
                  IconButton(
                    icon: const Icon(Icons.close, color: Colors.white),
                    onPressed: () => Navigator.pop(context),
                    tooltip: 'Fermer',
                  ),
                ],
              ),
            ),
            
            Expanded(
              child: SingleChildScrollView(
                padding: const EdgeInsets.all(16),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    // Titre
                    _buildSectionTitle('Titre du projet', theme),
                    const SizedBox(height: 8),
                    TextField(
                      controller: _titleController,
                      decoration: InputDecoration(
                        border: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(12),
                        ),
                        hintText: 'Saisissez le titre du projet',
                        filled: true,
                        fillColor: theme.cardColor,
                        prefixIcon: const Icon(Icons.title),
                      ),
                      maxLength: 100,
                    ),
                    const SizedBox(height: 16),
                    
                    // Description
                    _buildSectionTitle('Description', theme),
                    const SizedBox(height: 8),
                    TextField(
                      controller: _descriptionController,
                      decoration: InputDecoration(
                        border: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(12),
                        ),
                        hintText: 'Saisissez une description détaillée',
                        filled: true,
                        fillColor: theme.cardColor,
                        alignLabelWithHint: true,
                      ),
                      maxLines: 5,
                      maxLength: 500,
                    ),
                    const SizedBox(height: 16),
                    
                    // Date d'échéance
                    _buildSectionTitle('Date d\'échéance', theme),
                    const SizedBox(height: 8),
                    InkWell(
                      onTap: () => _selectDate(context),
                      borderRadius: BorderRadius.circular(12),
                      child: Container(
                        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                        decoration: BoxDecoration(
                          border: Border.all(color: theme.dividerColor),
                          borderRadius: BorderRadius.circular(12),
                          color: theme.cardColor,
                        ),
                        child: Row(
                          children: [
                            Icon(Icons.calendar_today, color: theme.colorScheme.primary),
                            const SizedBox(width: 12),
                            Text(
                              _selectedDate != null
                                  ? _formatDate(_selectedDate!)
                                  : 'Choisir une date d\'échéance',
                              style: theme.textTheme.bodyLarge?.copyWith(
                                color: _selectedDate != null 
                                    ? theme.textTheme.bodyLarge?.color 
                                    : theme.hintColor,
                              ),
                            ),
                            const Spacer(),
                            Icon(Icons.arrow_drop_down, color: theme.hintColor),
                          ],
                        ),
                      ),
                    ),
                    const SizedBox(height: 16),
                    
                    // Statut du projet
                    _buildSectionTitle('Statut du projet', theme),
                    const SizedBox(height: 8),
                    _buildStatusSelector(theme, isSmall, isVerySmall),
                    const SizedBox(height: 16),
                    
                    // Option Favoris
                    Row(
                      children: [
                        Switch(
                          value: _isFavorite,
                          onChanged: (value) {
                            setState(() {
                              _isFavorite = value;
                            });
                          },
                          activeColor: theme.colorScheme.primary,
                        ),
                        const SizedBox(width: 8),
                        Text(
                          'Ajouter aux favoris',
                          style: theme.textTheme.titleMedium,
                        ),
                        if (_isFavorite) ...[
                          const SizedBox(width: 8),
                          const Icon(Icons.star, color: Colors.amber),
                        ],
                      ],
                    ),
                  ],
                ),
              ),
            ),
            
            const Divider(height: 1),
            
            // Actions
            Padding(
              padding: const EdgeInsets.all(16),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.end,
                children: [
                  OutlinedButton(
                    onPressed: () => Navigator.pop(context),
                    child: const Text('Annuler'),
                    style: OutlinedButton.styleFrom(
                      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                    ),
                  ),
                  const SizedBox(width: 12),
                  ElevatedButton(
                    onPressed: _isLoading ? null : _saveProjectSettings,
                    style: ElevatedButton.styleFrom(
                      backgroundColor: theme.colorScheme.primary,
                      foregroundColor: Colors.white,
                      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                      disabledBackgroundColor: theme.disabledColor,
                    ),
                    child: _isLoading
                        ? const SizedBox(
                            width: 20,
                            height: 20,
                            child: CircularProgressIndicator(
                              strokeWidth: 2,
                              valueColor: AlwaysStoppedAnimation<Color>(Colors.white),
                            ),
                          )
                        : const Text('Enregistrer'),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildSectionTitle(String title, ThemeData theme) {
    return Text(
      title,
      style: theme.textTheme.titleMedium?.copyWith(
        fontWeight: FontWeight.bold,
      ),
    );
  }

  Widget _buildStatusSelector(ThemeData theme, bool isSmall, bool isVerySmall) {
    final statuses = [
      (ProjectStatus.ontrack, 'En cours', Colors.blue, Icons.play_circle_outline),
      (ProjectStatus.offtrack, 'En retard', Colors.red, Icons.error_outline),
      (ProjectStatus.completed, 'Terminé', Colors.green, Icons.check_circle_outline),
    ];
    
    return isVerySmall
        ? Column(
            children: statuses.map((s) => _buildStatusOption(s, theme, true)).toList(),
          )
        : Row(
            children: [
              for (var s in statuses) ...[
                Expanded(child: _buildStatusOption(s, theme, false)),
                if (s != statuses.last) const SizedBox(width: 8),
              ],
            ],
          );
  }

  Widget _buildStatusOption(
    (ProjectStatus, String, Color, IconData) statusInfo,
    ThemeData theme,
    bool isVertical,
  ) {
    final (status, label, color, icon) = statusInfo;
    final isSelected = _selectedStatus == status;

    return GestureDetector(
      onTap: () {
        setState(() {
          _selectedStatus = status;
        });
      },
      child: Container(
        margin: EdgeInsets.symmetric(vertical: isVertical ? 4 : 0),
        padding: const EdgeInsets.symmetric(vertical: 12, horizontal: 8),
        decoration: BoxDecoration(
          borderRadius: BorderRadius.circular(12),
          border: Border.all(
            color: isSelected ? color : theme.dividerColor,
            width: isSelected ? 2 : 1,
          ),
          color: isSelected ? color.withOpacity(0.1) : theme.cardColor,
        ),
        child: Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(
              icon,
              color: color,
              size: 20,
            ),
            const SizedBox(width: 8),
            Text(
              label,
              style: theme.textTheme.bodyMedium?.copyWith(
                fontWeight: isSelected ? FontWeight.bold : FontWeight.normal,
                color: isSelected ? color : theme.textTheme.bodyLarge?.color,
              ),
            ),
          ],
        ),
      ),
    );
  }
}