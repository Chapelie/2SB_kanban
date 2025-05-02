import 'dart:math' as math;
import 'package:flutter/material.dart';
import '../models/user.dart';
import '../services/auth_service.dart';

class AuthController with ChangeNotifier {
  final AuthService _authService = AuthService();
  
  User? _currentUser;
  bool _isLoading = false;
  String? _error;
  
  User? get currentUser => _currentUser;
  bool get isLoading => _isLoading;
  String? get error => _error;
  bool get isAuthenticated => _currentUser != null;
  
  // Initialiser l'état d'authentification
  Future<void> checkAuthStatus() async {
    _isLoading = true;
    notifyListeners();
    
    try {
      _currentUser = await _authService.getCurrentUser();
      _error = null;
    } catch (e) {
      _error = e.toString();
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }
  
  // Connexion
  Future<bool> login(String email, String password) async {
    _isLoading = true;
    _error = null;
    notifyListeners();
    
    try {
      _currentUser = await _authService.login(email, password);
      return true;
    } catch (e) {
      _error = e.toString();
      return false;
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }
  
  // Inscription
  Future<bool> register({
    required String name,
    required String email,
    required String password,
    String? location,
    String? avatar,
  }) async {
    _isLoading = true;
    _error = null;
    notifyListeners();
    
    try {
      // Générer les initiales à partir du nom
      final initials = name.split(' ')
          .map((part) => part.isNotEmpty ? part[0].toUpperCase() : '')
          .join('')
          .substring(0, math.min(2, name.split(' ').length));
      
      _currentUser = await _authService.register(
        name: name,
        email: email,
        password: password,
        location: location ?? '',
        avatar: avatar ?? '',
        initials: initials,
      );
      return true;
    } catch (e) {
      _error = e.toString();
      return false;
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }
  
  // Déconnexion
  Future<void> logout() async {
    _isLoading = true;
    notifyListeners();
    
    try {
      await _authService.logout();
      _currentUser = null;
    } catch (e) {
      _error = e.toString();
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }
  
  // Mettre à jour le profil de l'utilisateur
  Future<bool> updateProfile({
    String? name,
    String? email,
    String? location,
    String? avatar,
  }) async {
    if (_currentUser == null) return false;
    
    _isLoading = true;
    notifyListeners();
    
    try {
      final updatedUser = await _authService.updateProfile(
        userId: _currentUser!.id,
        name: name ?? _currentUser!.name,
        email: email ?? _currentUser!.email,
        location: location ?? _currentUser!.location,
        avatar: avatar ?? _currentUser!.avatar,
      );
      
      _currentUser = updatedUser;
      return true;
    } catch (e) {
      _error = e.toString();
      return false;
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }
  
  // Changer le mot de passe
  Future<bool> changePassword(String currentPassword, String newPassword) async {
    if (_currentUser == null) return false;
    
    _isLoading = true;
    notifyListeners();
    
    try {
      await _authService.changePassword(
        userId: _currentUser!.id,
        currentPassword: currentPassword,
        newPassword: newPassword,
      );
      return true;
    } catch (e) {
      _error = e.toString();
      return false;
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }
}