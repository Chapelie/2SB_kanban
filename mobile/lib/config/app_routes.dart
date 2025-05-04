import 'package:flutter/material.dart';
import '../views/auth/login_screen.dart';
import '../views/auth/register_screen.dart';
import '../views/auth/forgot_password_screen.dart';
import '../views/main/project_list_screen.dart';
import '../views/project_detail_screen.dart';
import '../views/main/home_screen.dart';
import '../views/settings_screen.dart';
import '../views/main/my_tasks_screen.dart'; // Ajout de l'import

class AppRoutes {
  static const String login = '/login';
  static const String home = '/home';
  static const String projectDetail = '/project-detail';
  static const String register = '/register';
  static const String forgotPassword = '/forgot-password';
  static const String settings = '/settings';
  static const String projectList = '/project-list';
  static const String myTasks = '/my-tasks'; // Ajout de la route

  static Route<dynamic> onGenerateRoute(RouteSettings routeSettings) {
    switch (routeSettings.name) {
      case login:
        return MaterialPageRoute(builder: (_) => const LoginScreen());
      case register:
        return MaterialPageRoute(builder: (_) => const RegisterScreen());
      case forgotPassword:
        return MaterialPageRoute(builder: (_) => const ForgotPasswordScreen());
      case home:
        return MaterialPageRoute(builder: (_) => const HomeScreen());
      case projectDetail:
        final projectId = routeSettings.arguments as String;
        return MaterialPageRoute(
          builder: (_) => ProjectDetailScreen(projectId: projectId),
        );
      case settings:
        return MaterialPageRoute(builder: (_) => const SettingsScreen());
      case projectList:
        return MaterialPageRoute(builder: (_) => const ProjectListScreen());
      case myTasks: // Ajout du case pour la nouvelle route
        return MaterialPageRoute(builder: (_) => const MyTasksScreen());
      default:
        // Si la route n'est pas trouvée, retourner à l'écran de connexion
        return MaterialPageRoute(builder: (_) => const LoginScreen());
    }
  }
}