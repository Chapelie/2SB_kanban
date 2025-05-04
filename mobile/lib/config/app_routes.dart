import 'package:flutter/material.dart';
import '../views/auth/login_screen.dart';
import '../views/auth/register_screen.dart';
import '../views/auth/forgot_password_screen.dart';
import '../views/main/project_list_screen.dart';
import '../views/project_detail_screen.dart';
import '../views/main/home_screen.dart';
import '../views/settings_screen.dart';
import '../views/main/my_tasks_screen.dart';
import '../views/onboarding_screen.dart'; 
class AppRoutes {
  static const String onboarding = '/onboarding';  // Nouvelle route
  static const String login = '/login';
  static const String home = '/home';
  static const String projectDetail = '/project-detail';
  static const String register = '/register';
  static const String forgotPassword = '/forgot-password';
  static const String settings = '/settings';
  static const String projectList = '/project-list';
  static const String myTasks = '/my-tasks';

  static Route<dynamic> onGenerateRoute(RouteSettings routeSettings) {
    switch (routeSettings.name) {
      case onboarding:  // Nouveau case
        return MaterialPageRoute(builder: (_) => const OnboardingScreen());
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
      case myTasks:
        return MaterialPageRoute(builder: (_) => const MyTasksScreen());
      default:
        return MaterialPageRoute(builder: (_) => const OnboardingScreen());  // Changé pour l'onboarding par défaut
    }
  }
}