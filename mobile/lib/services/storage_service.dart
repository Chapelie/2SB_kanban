import 'package:hive_flutter/hive_flutter.dart';

class StorageService {
  static Future<void> init() async {
    await Hive.initFlutter();

    // Ouverture des boîtes pour le stockage des données
    await Hive.openBox('users');
    await Hive.openBox('projects');
    await Hive.openBox('tasks');
    await Hive.openBox('auth');
    await Hive.openBox(
      'passwords',
    ); // Pour stocker les mots de passe séparément
  }

  // Sauvegarde d'un élément dans une box
  static Future<void> save(String boxName, String key, dynamic value) async {
    final box = Hive.box(boxName);
    await box.put(key, value);
  }

  // Récupération d'un élément
  static dynamic get(String boxName, String key) {
    final box = Hive.box(boxName);
    return box.get(key);
  }

  // Récupération de tous les éléments d'une box
  static List<dynamic> getAll(String boxName) {
    final box = Hive.box(boxName);
    return box.values.toList();
  }

  // Suppression d'un élément
  static Future<void> delete(String boxName, String key) async {
    final box = Hive.box(boxName);
    await box.delete(key);
  }

  // Vider une box
  static Future<void> clear(String boxName) async {
    final box = Hive.box(boxName);
    await box.clear();
  }

  // Vérifier si une clé existe
  static bool exists(String boxName, String key) {
    final box = Hive.box(boxName);
    return box.containsKey(key);
  }
}
