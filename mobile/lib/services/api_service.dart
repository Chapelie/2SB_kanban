import 'dart:convert';
import 'package:http/http.dart' as http;
import 'storage_service.dart';

class ApiService {
  // URL de base de l'API
  static const String baseUrl = 'http://192.168.137.1:8000/api';
  
  // Headers par défaut pour les requêtes API
  static Map<String, String> _getHeaders([String? token]) {
    final headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };
    
    // Ajouter le token d'authentification s'il est disponible
    if (token != null) {
      headers['Authorization'] = 'Bearer $token';
    } else {
      final storedToken = StorageService.get('auth', 'token');
      if (storedToken != null) {
        headers['Authorization'] = 'Bearer $storedToken';
      }
    }
    
    return headers;
  }
  
  // Méthode GET
  static Future<dynamic> get(String endpoint) async {
    try {
      print('GET request to: $baseUrl$endpoint');
      final response = await http.get(
        Uri.parse('$baseUrl$endpoint'),
        headers: _getHeaders(),
      ).timeout(const Duration(seconds: 10));
      
      print('GET response status: ${response.statusCode}');
      return _handleResponse(response);
    } catch (e) {
      print('GET error: $e');
      _handleNetworkError(e);
    }
  }
  
  // Méthode POST
  static Future<dynamic> post(String endpoint, Map<String, dynamic> data) async {
    try {
      print('POST request to: $baseUrl$endpoint');
      print('POST request body: ${jsonEncode(data)}');
      
      final response = await http.post(
        Uri.parse('$baseUrl$endpoint'),
        headers: _getHeaders(),
        body: jsonEncode(data),
      ).timeout(const Duration(seconds: 10));
      
      print('POST response status: ${response.statusCode}');
      print('POST response body: ${response.body}');
      
      return _handleResponse(response);
    } catch (e) {
      print('POST error: $e');
      return _handleNetworkError(e);
    }
  }
  
  // Méthode PUT
  static Future<dynamic> put(String endpoint, Map<String, dynamic> data) async {
    try {
      print('PUT request to: $baseUrl$endpoint');
      final response = await http.put(
        Uri.parse('$baseUrl$endpoint'),
        headers: _getHeaders(),
        body: jsonEncode(data),
      ).timeout(const Duration(seconds: 10));
      
      print('PUT response status: ${response.statusCode}');
      return _handleResponse(response);
    } catch (e) {
      print('PUT error: $e');
      return _handleNetworkError(e);
    }
  }
  
  // Méthode DELETE
  static Future<dynamic> delete(String endpoint) async {
    try {
      print('DELETE request to: $baseUrl$endpoint');
      final response = await http.delete(
        Uri.parse('$baseUrl$endpoint'),
        headers: _getHeaders(),
      ).timeout(const Duration(seconds: 10));
      
      print('DELETE response status: ${response.statusCode}');
      return _handleResponse(response);
    } catch (e) {
      print('DELETE error: $e');
      return _handleNetworkError(e);
    }
  }
  
  // Gestion des erreurs réseau
  static dynamic _handleNetworkError(dynamic error) {
    String message = 'Erreur de connexion au serveur';
    
    if (error.toString().contains('SocketException') || 
        error.toString().contains('Connection refused')) {
      message = 'Impossible de se connecter au serveur. Vérifiez votre connexion internet.';
    } else if (error.toString().contains('TimeoutException')) {
      message = 'La requête a pris trop de temps. Veuillez réessayer.';
    } else if (error.toString().contains('HandshakeException')) {
      message = 'Problème de sécurité lors de la connexion au serveur.';
    }
    
    throw Exception(message);
  }
  
  // Gestion des réponses et des erreurs
  static dynamic _handleResponse(http.Response response) {
    // IMPORTANT: Considérer 201 comme un succès (Created)
    if (response.statusCode >= 200 && response.statusCode < 300) {
      // Succès (y compris 201 Created pour les nouvelles inscriptions)
      if (response.body.isEmpty) {
        print('Empty response body but success status: ${response.statusCode}');
        return {};
      }
      
      try {
        final jsonResponse = json.decode(response.body);
        print('Response parsed successfully');
        return jsonResponse;
      } catch (e) {
        print('Error parsing JSON response: $e');
        throw Exception('Erreur lors du traitement de la réponse du serveur');
      }
    } else {
      // Erreur
      print('Error response (${response.statusCode}): ${response.body}');
      Map<String, dynamic> errorData = {};
      
      try {
        if (response.body.isNotEmpty) {
          errorData = json.decode(response.body);
        }
      } catch (e) {
        print('Error parsing error response: $e');
        errorData = {'message': 'Erreur inconnue'};
      }
      
      // Gestion spécifique des erreurs de validation
      if (response.statusCode == 422 && errorData.containsKey('errors')) {
        // Laravel/Symfony renvoient souvent les erreurs de validation dans un objet 'errors'
        var errors = errorData['errors'];
        if (errors is Map) {
          // Construire un message d'erreur lisible à partir des erreurs de validation
          List<String> errorMessages = [];
          errors.forEach((key, value) {
            if (value is List) {
              errorMessages.add("${key.toUpperCase()}: ${value.join(', ')}");
            } else {
              errorMessages.add("${key.toUpperCase()}: $value");
            }
          });
          throw Exception(errorMessages.join('\n'));
        }
      }
      
      // Essayer de trouver un message d'erreur dans différents formats possibles
      final errorMessage = errorData['message'] ?? 
                         errorData['error'] ?? 
                         errorData['detail'] ??
                         (errorData['errors'] != null ? 'Erreur de validation' : null) ??
                         'Erreur ${response.statusCode}';
      
      throw Exception(errorMessage);
    }
  }
}