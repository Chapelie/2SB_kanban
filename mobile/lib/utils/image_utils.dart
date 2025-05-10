import 'dart:convert';
import 'dart:typed_data';
import 'package:flutter/material.dart';
import 'package:image_picker/image_picker.dart';

class ImageUtils {
  // Convertir une image depuis la galerie ou la caméra en Base64
  static Future<String?> pickImageToBase64({
    required ImageSource source,
    int quality = 85,
    int maxWidth = 800,
    int maxHeight = 800,
  }) async {
    try {
      final ImagePicker picker = ImagePicker();
      final XFile? image = await picker.pickImage(
        source: source,
        imageQuality: quality,
        maxWidth: maxWidth.toDouble(),
        maxHeight: maxHeight.toDouble(),
      );

      if (image == null) return null;

      // Lire les bytes de l'image
      final bytes = await image.readAsBytes();

      // Convertir en Base64
      return base64Encode(bytes);
    } catch (e) {
      print('Erreur lors de la conversion de l\'image: $e');
      return null;
    }
  }

  // Convertir une chaîne Base64 en Image Widget
  static Widget base64ToImage(
    String base64String, {
    double width = 100,
    double height = 100,
    BoxFit fit = BoxFit.cover,
    Widget? placeholder,
  }) {
    try {
      if (base64String.isEmpty) {
        return placeholder ?? _defaultAvatar(width, height);
      }

      // Décoder la chaîne Base64
      Uint8List bytes = base64Decode(base64String);

      return Image.memory(
        bytes,
        width: width,
        height: height,
        fit: fit,
        errorBuilder: (context, error, stackTrace) {
          return placeholder ?? _defaultAvatar(width, height);
        },
      );
    } catch (e) {
      print('Erreur lors du décodage de l\'image: $e');
      return placeholder ?? _defaultAvatar(width, height);
    }
  }

  // Avatar par défaut si l'image est invalide
  static Widget _defaultAvatar(double width, double height) {
    return Container(
      width: width,
      height: height,
      decoration: BoxDecoration(
        color: Colors.grey[300],
        shape: BoxShape.circle,
      ),
      child: Icon(
        Icons.person,
        color: Colors.grey[700],
        size: width * 0.6,
      ),
    );
  }

  // Vérifier si une chaîne est un Base64 valide
  static bool isValidBase64(String str) {
    try {
      base64Decode(str);
      return true;
    } catch (e) {
      return false;
    }
  }
}
