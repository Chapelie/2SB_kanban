import 'dart:convert';
import 'dart:math' as math;
import 'package:uuid/uuid.dart';
import '../models/user.dart';
import 'storage_service.dart';

class AuthService {
  // Connexion d'un utilisateur
  Future<User> login(String email, String password) async {
    // Récupérer tous les utilisateurs enregistrés
    final usersJson = StorageService.getAll('users');
    final users = <User>[];

    for (var userJson in usersJson) {
      if (userJson is String) {
        users.add(User.fromJson(json.decode(userJson)));
      }
    }

    // Vérifier si l'utilisateur existe
    final userIndex = users.indexWhere((u) => u.email == email);
    if (userIndex == -1) {
      throw Exception('Email ou mot de passe incorrect');
    }

    // Vérifier le mot de passe
    final userId = users[userIndex].id;
    final storedPassword = StorageService.get('passwords', userId);

    if (storedPassword != password) {
      throw Exception('Email ou mot de passe incorrect');
    }

    // Stocker l'ID de l'utilisateur connecté
    await StorageService.save('auth', 'currentUserId', userId);

    return users[userIndex];
  }

  // Inscription d'un nouvel utilisateur
  Future<User> register({
    required String name,
    required String email,
    required String password,
    required String location,
    required String avatar,
    required String initials,
  }) async {
    // Récupérer tous les utilisateurs enregistrés
    final usersJson = StorageService.getAll('users');
    final users = <User>[];

    for (var userJson in usersJson) {
      if (userJson is String) {
        users.add(User.fromJson(json.decode(userJson)));
      }
    }

    // Vérifier si l'email existe déjà
    if (users.any((u) => u.email == email)) {
      throw Exception('Cet email est déjà utilisé');
    }

    // Créer un nouvel utilisateur
    final id = const Uuid().v4();
    final user = User(
      id: id, 
      name: name, 
      email: email,
      location: location,
      avatar: avatar,
      initials: initials,
      role: 'user', // Rôle par défaut
    );

    // Sauvegarder l'utilisateur
    await StorageService.save('users', id, jsonEncode(user.toJson()));

    // Sauvegarder le mot de passe séparément
    await StorageService.save('passwords', id, password);

    // Auto login
    await StorageService.save('auth', 'currentUserId', id);

    return user;
  }

  // Déconnexion
  Future<void> logout() async {
    await StorageService.delete('auth', 'currentUserId');
  }

  // Récupérer l'utilisateur courant
  Future<User?> getCurrentUser() async {
    final userId = StorageService.get('auth', 'currentUserId');
    if (userId == null) return null;

    final userJson = StorageService.get('users', userId);
    if (userJson == null) return null;

    return User.fromJson(json.decode(userJson));
  }
  
  // Mettre à jour le profil de l'utilisateur
  Future<User> updateProfile({
    required String userId,
    required String name,
    required String email,
    required String location,
    required String avatar,
  }) async {
    final userJson = StorageService.get('users', userId);
    if (userJson == null) {
      throw Exception('Utilisateur non trouvé');
    }
    
    final currentUser = User.fromJson(json.decode(userJson));
    
    // Mettre à jour les initiales si le nom a changé
    String initials = currentUser.initials;
    if (name != currentUser.name) {
      initials = name.split(' ')
          .map((part) => part.isNotEmpty ? part[0].toUpperCase() : '')
          .join('')
          .substring(0, math.min(2, name.split(' ').length));
    }
    
    final updatedUser = User(
      id: userId,
      name: name,
      email: email,
      location: location,
      avatar: avatar,
      initials: initials,
      role: currentUser.role,
    );
    
    await StorageService.save('users', userId, jsonEncode(updatedUser.toJson()));
    
    return updatedUser;
  }
  
  // Changer le mot de passe
  Future<void> changePassword({
    required String userId,
    required String currentPassword,
    required String newPassword,
  }) async {
    final storedPassword = StorageService.get('passwords', userId);
    
    if (storedPassword != currentPassword) {
      throw Exception('Le mot de passe actuel est incorrect');
    }
    
    await StorageService.save('passwords', userId, newPassword);
  }
}