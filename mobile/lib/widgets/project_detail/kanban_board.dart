import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:provider/provider.dart';
import '../../controllers/task_controller.dart';
import '../../models/task.dart';
import '../TaskCard.dart';

class KanbanBoard extends StatefulWidget {
  final Function(Task) onTaskTap;
  final Function() onAddTask;
  final Function() onRefresh;

  const KanbanBoard({
    Key? key,
    required this.onTaskTap,
    required this.onAddTask,
    required this.onRefresh,
  }) : super(key: key);

  @override
  State<KanbanBoard> createState() => _KanbanBoardState();
}

class _KanbanBoardState extends State<KanbanBoard>
    with TickerProviderStateMixin {
  final List<String> _columns = ['À faire', 'En cours', 'Terminé'];
  final List<TaskStatus> _statuses = [
    TaskStatus.open,
    TaskStatus.inProgress,
    TaskStatus.completed
  ];
  final List<Color> _columnColors = [Colors.grey, Colors.blue, Colors.green];

  // Utiliser un PageController au lieu d'un ScrollController
  late PageController _pageController;
  int _currentPage = 0;

  // Garde une trace d'une tâche en cours de glissement
  Task? _draggingTask;

  // Index de la colonne actuellement survolée (pour le feedback visuel)
  int? _hoveredColumnIndex;

  @override
  void initState() {
    super.initState();

    // Initialiser le PageController avec viewportFraction pour montrer une partie des colonnes adjacentes
    _pageController = PageController(
      initialPage: 0,
      viewportFraction: 0.85, // Montrer un peu des colonnes voisines
    );

    // Écouter les changements de page
    _pageController.addListener(_updateCurrentPage);
  }

  @override
  void dispose() {
    _pageController.removeListener(_updateCurrentPage);
    _pageController.dispose();
    super.dispose();
  }

  // Mettre à jour la page actuelle basée sur le PageController
  void _updateCurrentPage() {
    if (!mounted) return;

    final page = _pageController.page?.round() ?? 0;
    if (page != _currentPage) {
      setState(() {
        _currentPage = page;
      });
    }
  }

  // Fonction pour naviguer vers une colonne spécifique
  void _goToColumn(int index) {
    if (index < 0 || index >= _columns.length) return;

    _pageController.animateToPage(
      index,
      duration: const Duration(milliseconds: 300),
      curve: Curves.easeInOut,
    );
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final isDarkMode = theme.brightness == Brightness.dark;

    return RefreshIndicator(
      onRefresh: () async => widget.onRefresh(),
      child: Column(
        children: [
          // Indicateur de position élégant
          _buildPageIndicator(isDarkMode),

          // Tableau Kanban avec PageView
          Expanded(
            child: _buildKanbanPageView(isDarkMode),
          ),
        ],
      ),
    );
  }

  // Indicateur de page amélioré
  Widget _buildPageIndicator(bool isDarkMode) {
    return Container(
      padding: const EdgeInsets.symmetric(vertical: 8),
      color: Colors.transparent,
      child: Row(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          for (int i = 0; i < _columns.length; i++)
            GestureDetector(
              onTap: () => _goToColumn(i),
              child: AnimatedContainer(
                duration: const Duration(milliseconds: 250),
                width: _currentPage == i ? 24 : 8,
                height: 8,
                margin: const EdgeInsets.symmetric(horizontal: 4),
                decoration: BoxDecoration(
                  color: _currentPage == i
                      ? _columnColors[i]
                      : isDarkMode
                          ? Colors.grey[700]
                          : Colors.grey[300],
                  borderRadius: BorderRadius.circular(4),
                ),
              ),
            ),
        ],
      ),
    );
  }

  // PageView pour les colonnes Kanban
  Widget _buildKanbanPageView(bool isDarkMode) {
    return PageView.builder(
      controller: _pageController,
      itemCount: _statuses.length,
      itemBuilder: (context, index) {
        return Padding(
          padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
          child: _buildKanbanColumn(_statuses[index], _columns[index],
              _columnColors[index], index, isDarkMode),
        );
      },
    );
  }

  // Colonne Kanban
  Widget _buildKanbanColumn(TaskStatus status, String title, Color color,
      int columnIndex, bool isDarkMode) {
    final theme = Theme.of(context);

    // Couleurs adaptées au mode sombre
    final columnBgColor = isDarkMode
        ? Color.alphaBlend(
            theme.cardColor.withOpacity(0.2), Colors.grey.shade900)
        : Colors.white;

    final borderColor = isDarkMode ? color.withOpacity(0.5) : Colors.grey[300]!;

    final shadowColor = isDarkMode
        ? Colors.black.withOpacity(0.25)
        : Colors.black.withOpacity(0.05);

    return DragTarget<Task>(
      builder: (context, candidateItems, rejectedItems) {
        final isHovered = candidateItems.isNotEmpty;

        return Container(
          margin: const EdgeInsets.all(4),
          decoration: BoxDecoration(
            borderRadius: BorderRadius.circular(12),
            color: columnBgColor,
            border: Border.all(
              color: isHovered ? color : borderColor,
              width: isHovered
                  ? 2
                  : isDarkMode
                      ? 1.5
                      : 1,
            ),
            boxShadow: [
              BoxShadow(
                color: shadowColor,
                blurRadius: 6,
                offset: const Offset(0, 3),
                spreadRadius: isDarkMode ? 1 : 0,
              ),
            ],
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              // En-tête de la colonne
              _buildColumnHeader(status, title, color, isDarkMode),

              // Contenu de la colonne
              Expanded(
                child: Container(
                  color: isHovered
                      ? color.withOpacity(isDarkMode ? 0.1 : 0.05)
                      : null,
                  child: _buildColumnContent(
                      status, title, color, isHovered, isDarkMode),
                ),
              ),

              // Pied de colonne (bouton ou indicateur de dépôt)
              _buildColumnFooter(status, title, color, isHovered, isDarkMode),
            ],
          ),
        );
      },
      onWillAccept: (Task? task) {
        if (task == null) return false;

        // Ne pas accepter si la tâche est déjà dans cette colonne
        if (task.status == status) return false;

        setState(() {
          _hoveredColumnIndex = columnIndex;
          _draggingTask = task;
        });

        return true;
      },
      onLeave: (Task? task) {
        setState(() {
          if (_hoveredColumnIndex == columnIndex) {
            _hoveredColumnIndex = null;
          }
        });
      },
      onAccept: (Task task) {
        // Mettre à jour le statut de la tâche
        context.read<TaskController>().updateTaskStatus(task.id, status);

        // Feedback tactile
        HapticFeedback.mediumImpact();

        // Notification
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Tâche "${task.title}" déplacée vers $title'),
            backgroundColor: color,
            duration: const Duration(seconds: 2),
            behavior: SnackBarBehavior.floating,
            margin: const EdgeInsets.all(16),
          ),
        );

        // Réinitialiser l'état
        setState(() {
          _draggingTask = null;
          _hoveredColumnIndex = null;
        });
      },
    );
  }

  // En-tête de colonne
  Widget _buildColumnHeader(
      TaskStatus status, String title, Color color, bool isDarkMode) {
    return Container(
      padding: const EdgeInsets.symmetric(vertical: 16, horizontal: 16),
      decoration: BoxDecoration(
        color: color.withOpacity(isDarkMode ? 0.2 : 0.1),
        borderRadius: const BorderRadius.only(
          topLeft: Radius.circular(11),
          topRight: Radius.circular(11),
        ),
        border: Border(
          bottom: BorderSide(
            color: color.withOpacity(isDarkMode ? 0.4 : 0.3),
            width: isDarkMode ? 1.5 : 1,
          ),
        ),
      ),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Row(
            children: [
              Icon(
                _getIconForStatus(status),
                color: color,
                size: 20,
              ),
              const SizedBox(width: 10),
              Text(
                title,
                style: TextStyle(
                  color: color,
                  fontWeight: FontWeight.bold,
                  fontSize: 17,
                ),
              ),
            ],
          ),
          Consumer<TaskController>(
            builder: (context, taskController, _) {
              final count = taskController.getTasksByStatus(status).length;
              final bgColor = isDarkMode ? Colors.grey.shade800 : Colors.white;
              final textColor = isDarkMode ? color.withOpacity(0.9) : color;

              return Container(
                padding:
                    const EdgeInsets.symmetric(horizontal: 10, vertical: 3),
                decoration: BoxDecoration(
                  color: bgColor,
                  borderRadius: BorderRadius.circular(14),
                  boxShadow: [
                    BoxShadow(
                      color: color.withOpacity(isDarkMode ? 0.3 : 0.2),
                      blurRadius: 2,
                      offset: const Offset(0, 1),
                    ),
                  ],
                  border: isDarkMode
                      ? Border.all(
                          color: color.withOpacity(0.3),
                          width: 1,
                        )
                      : null,
                ),
                child: Text(
                  count.toString(),
                  style: TextStyle(
                    color: textColor,
                    fontWeight: FontWeight.bold,
                    fontSize: 14,
                  ),
                ),
              );
            },
          ),
        ],
      ),
    );
  }

  // Contenu de la colonne
  Widget _buildColumnContent(TaskStatus status, String title, Color color,
      bool isHovered, bool isDarkMode) {
    return Consumer<TaskController>(
      builder: (context, taskController, _) {
        final tasks = taskController.getTasksByStatus(status);

        if (tasks.isEmpty) {
          return _buildEmptyColumn(status, color, isHovered, isDarkMode);
        }

        return ListView.builder(
          padding: const EdgeInsets.only(top: 8),
          itemCount: tasks.length,
          itemBuilder: (context, index) {
            final task = tasks[index];
            return _buildDraggableTaskCard(task, color, isDarkMode);
          },
        );
      },
    );
  }

  // Pied de colonne
  Widget _buildColumnFooter(TaskStatus status, String title, Color color,
      bool isHovered, bool isDarkMode) {
    if (status == TaskStatus.open) {
      final bgColor = isDarkMode
          ? Color.alphaBlend(
              Colors.grey.shade900.withOpacity(0.5), Colors.white)
          : Colors.white;

      final buttonColor =
          isDarkMode ? color.withOpacity(0.15) : color.withOpacity(0.1);

      final textColor =
          isDarkMode ? color.withOpacity(0.9) : color.withOpacity(0.8);

      return Container(
        padding: const EdgeInsets.fromLTRB(12, 8, 12, 12),
        decoration: BoxDecoration(
          color: bgColor,
          borderRadius: const BorderRadius.only(
            bottomLeft: Radius.circular(11),
            bottomRight: Radius.circular(11),
          ),
        ),
        child: Material(
          borderRadius: BorderRadius.circular(8),
          color: buttonColor,
          child: InkWell(
            onTap: widget.onAddTask,
            borderRadius: BorderRadius.circular(8),
            child: Padding(
              padding: const EdgeInsets.symmetric(vertical: 12),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Icon(
                    Icons.add_circle_outline,
                    size: 18,
                    color: textColor,
                  ),
                  const SizedBox(width: 8),
                  Text(
                    'Ajouter une tâche',
                    style: TextStyle(
                      color: textColor,
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                ],
              ),
            ),
          ),
        ),
      );
    } else if (isHovered &&
        _draggingTask != null &&
        _draggingTask!.status != status) {
      return Container(
        padding: const EdgeInsets.all(12),
        decoration: BoxDecoration(
          color: color.withOpacity(isDarkMode ? 0.15 : 0.1),
          borderRadius: const BorderRadius.only(
            bottomLeft: Radius.circular(11),
            bottomRight: Radius.circular(11),
          ),
        ),
        child: Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(Icons.arrow_downward, color: color, size: 16),
            const SizedBox(width: 8),
            Text(
              'Déposer ici',
              style: TextStyle(
                color: isDarkMode ? color.withOpacity(0.9) : color,
                fontWeight: FontWeight.bold,
              ),
            ),
          ],
        ),
      );
    } else {
      return Container(height: 1); // Placeholder pour maintenir la structure
    }
  }

  // Carte de tâche glissable
  Widget _buildDraggableTaskCard(
      Task task, Color columnColor, bool isDarkMode) {
    return Draggable<Task>(
      data: task,
      feedback: Material(
        elevation: 8,
        borderRadius: BorderRadius.circular(10),
        child: Container(
          width: MediaQuery.of(context).size.width * 0.7,
          child: TaskCard(
            task: task,
            onTap: () {}, // Désactiver le onTap pour le feedback
          ),
        ),
      ),
      childWhenDragging: Opacity(
        opacity: 0.3,
        child: TaskCard(
          task: task,
          onTap: () => widget.onTaskTap(task),
        ),
      ),
      onDragStarted: () {
        setState(() {
          _draggingTask = task;
        });
        HapticFeedback.selectionClick();
      },
      onDraggableCanceled: (_, __) {
        setState(() {
          _draggingTask = null;
          _hoveredColumnIndex = null;
        });
      },
      onDragEnd: (_) {
        setState(() {
          _draggingTask = null;
          _hoveredColumnIndex = null;
        });
      },
      affinity: Axis.horizontal,
      maxSimultaneousDrags: 1,
      child: Container(
        margin: const EdgeInsets.fromLTRB(10, 0, 10, 10),
        decoration: BoxDecoration(
          borderRadius: BorderRadius.circular(10),
          boxShadow: [
            BoxShadow(
              color: isDarkMode
                  ? Colors.black.withOpacity(0.2)
                  : Colors.black.withOpacity(0.05),
              blurRadius: isDarkMode ? 4 : 3,
              offset: const Offset(0, 1),
              spreadRadius: isDarkMode ? 1 : 0,
            ),
          ],
        ),
        child: ClipRRect(
          borderRadius: BorderRadius.circular(10),
          child: Stack(
            children: [
              TaskCard(
                task: task,
                onTap: () => widget.onTaskTap(task),
              ),

              // Badge indiquant la priorité
              Positioned(
                top: 0,
                left: 0,
                child: _buildPriorityIndicator(task.priority, columnColor),
              ),

              // Indicateur visuel pour glisser
              Positioned(
                top: 0,
                right: 0,
                child: Container(
                  width: 28,
                  height: 28,
                  decoration: BoxDecoration(
                    color: columnColor.withOpacity(0.8),
                    borderRadius: const BorderRadius.only(
                      bottomLeft: Radius.circular(10),
                    ),
                  ),
                  child: const Icon(
                    Icons.drag_indicator,
                    color: Colors.white,
                    size: 16,
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  // Colonne vide
  Widget _buildEmptyColumn(
      TaskStatus status, Color color, bool isHovered, bool isDarkMode) {
    final emptyTextColor = isDarkMode ? Colors.grey[400] : Colors.grey[600];

    final titleColor = isDarkMode ? color.withOpacity(0.9) : color;

    return Center(
      child: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Container(
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: color.withOpacity(isDarkMode ? 0.2 : 0.1),
                shape: BoxShape.circle,
                border: isDarkMode
                    ? Border.all(
                        color: color.withOpacity(0.3),
                        width: 1,
                      )
                    : null,
              ),
              child: Icon(
                _getIconForStatus(status),
                size: 24,
                color: color.withOpacity(isDarkMode ? 0.8 : 0.6),
              ),
            ),
            const SizedBox(height: 12),
            Text(
              _getEmptyTitle(status),
              textAlign: TextAlign.center,
              style: TextStyle(
                color: titleColor,
                fontWeight: FontWeight.w600,
                fontSize: 15,
              ),
            ),
            const SizedBox(height: 8),
            Text(
              _getEmptyMessage(status),
              textAlign: TextAlign.center,
              style: TextStyle(
                color: emptyTextColor,
                fontSize: 13,
              ),
            ),
            const SizedBox(height: 20),

            // Zone de dépôt visuelle
            if (_draggingTask != null && isHovered)
              Container(
                padding:
                    const EdgeInsets.symmetric(vertical: 12, horizontal: 16),
                decoration: BoxDecoration(
                  color: color.withOpacity(isDarkMode ? 0.2 : 0.1),
                  borderRadius: BorderRadius.circular(10),
                  border: Border.all(
                    color: color.withOpacity(isDarkMode ? 0.5 : 0.3),
                    width: isDarkMode ? 1.5 : 1,
                    style: BorderStyle.solid,
                  ),
                ),
                child: Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Icon(Icons.add_task, size: 18, color: titleColor),
                    const SizedBox(width: 8),
                    Text(
                      'Déposer ici',
                      style: TextStyle(
                        color: titleColor,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ],
                ),
              ),
          ],
        ),
      ),
    );
  }

  // Indicateur de priorité
  Widget _buildPriorityIndicator(TaskPriority priority, Color columnColor) {
    Color priorityColor;
    IconData priorityIcon;

    switch (priority) {
      case TaskPriority.high:
        priorityColor = Colors.red;
        priorityIcon = Icons.priority_high;
        break;
      case TaskPriority.medium:
        priorityColor = Colors.orange;
        priorityIcon = Icons.remove;
        break;
      case TaskPriority.low:
        priorityColor = Colors.green;
        priorityIcon = Icons.arrow_downward;
        break;
    }

    return Container(
      width: 28,
      height: 28,
      decoration: BoxDecoration(
        color: priorityColor.withOpacity(0.8),
        borderRadius: const BorderRadius.only(
          bottomRight: Radius.circular(10),
        ),
      ),
      child: Icon(
        priorityIcon,
        color: Colors.white,
        size: 16,
      ),
    );
  }

  // Colonne vide

  // Titre pour colonne vide
  String _getEmptyTitle(TaskStatus status) {
    switch (status) {
      case TaskStatus.open:
        return 'À faire';
      case TaskStatus.inProgress:
        return 'En cours';
      case TaskStatus.completed:
        return 'Terminé';
      case TaskStatus.canceled:
        return 'Annulé';
    }
  }

  // Icône pour le statut de la tâche
  IconData _getIconForStatus(TaskStatus status) {
    switch (status) {
      case TaskStatus.open:
        return Icons.inbox_outlined;
      case TaskStatus.inProgress:
        return Icons.pending_actions_outlined;
      case TaskStatus.completed:
        return Icons.task_outlined;
      case TaskStatus.canceled:
        return Icons.cancel_outlined;
    }
  }

  // Message pour colonne vide
  String _getEmptyMessage(TaskStatus status) {
    switch (status) {
      case TaskStatus.open:
        return 'Les tâches à faire apparaîtront ici.\nGlissez une tâche ou ajoutez-en une nouvelle.';
      case TaskStatus.inProgress:
        return 'Les tâches en cours apparaîtront ici.\nGlissez une tâche pour commencer à y travailler.';
      case TaskStatus.completed:
        return 'Les tâches terminées apparaîtront ici.\nGlissez une tâche pour la marquer comme terminée.';
      case TaskStatus.canceled:
        return 'Les tâches annulées apparaîtront ici.\nGlissez une tâche pour l\'annuler.';
    }
  }
}
