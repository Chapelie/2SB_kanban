import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../config/themes.dart';

class ThemeProvider extends ChangeNotifier {
  bool _isDarkMode = false;
  String _themeType = 'light'; // 'light', 'dark', 'blue'
  Color _accentColor = AppTheme.lightAccentColor;
  String _fontFamily = 'Roboto';
  ThemeData _currentTheme = AppTheme.lightTheme;

  ThemeProvider() {
    loadThemePreferences();
  }

  // Getters
  bool get isDarkMode => _isDarkMode;
  String get themeType => _themeType;
  Color get accentColor => _accentColor;
  String get fontFamily => _fontFamily;
  ThemeData get currentTheme => _currentTheme;

  // Setters
  void setDarkMode(bool value) {
    _isDarkMode = value;
    _themeType = value ? 'dark' : 'light';
    _updateTheme();
    notifyListeners();
  }

  void setThemeType(String type) {
    _themeType = type;
    _isDarkMode = type == 'dark';
    _updateTheme();
    notifyListeners();
  }

  void setAccentColor(Color color) {
    _accentColor = color;
    _updateTheme();
    notifyListeners();
  }

  void setFontFamily(String fontFamily) {
    _fontFamily = fontFamily;
    _updateTheme();
    notifyListeners();
  }

  // Méthode pour mettre à jour le thème actuel
  void _updateTheme() {
    switch (_themeType) {
      case 'dark':
        _currentTheme = _customizeTheme(AppTheme.darkTheme);
        break;
      case 'blue':
        _currentTheme = _customizeTheme(AppTheme.blueTheme);
        break;
      case 'light':
      default:
        _currentTheme = _customizeTheme(AppTheme.lightTheme);
        break;
    }
  }

  // Méthode pour personnaliser un thème avec l'accent et la police
  ThemeData _customizeTheme(ThemeData baseTheme) {
    return baseTheme.copyWith(
      colorScheme: baseTheme.colorScheme.copyWith(
        primary: _accentColor,
        secondary: _accentColor.withOpacity(0.8),
      ),
      textTheme: _getCustomTextTheme(baseTheme.textTheme),
      primaryColor: _accentColor,
    );
  }

  // Méthode pour appliquer la police personnalisée
  TextTheme _getCustomTextTheme(TextTheme baseTextTheme) {
    // Sans l'importation des polices, nous ne pouvons pas les appliquer réellement
    // Mais la structure est en place pour une implémentation future
    return baseTextTheme;
  }

  // Méthodes pour sauvegarder/charger les préférences
  Future<void> saveThemePreferences() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      await prefs.setBool('isDarkMode', _isDarkMode);
      await prefs.setString('themeType', _themeType);
      await prefs.setInt('accentColor', _accentColor.value);
      await prefs.setString('fontFamily', _fontFamily);
    } catch (e) {
      print('Erreur lors de la sauvegarde des préférences de thème: $e');
    }
  }

  Future<void> loadThemePreferences() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      _isDarkMode = prefs.getBool('isDarkMode') ?? false;
      _themeType = prefs.getString('themeType') ?? 'light';
      _accentColor = Color(prefs.getInt('accentColor') ?? AppTheme.lightAccentColor.value);
      _fontFamily = prefs.getString('fontFamily') ?? 'Roboto';
      _updateTheme();
      notifyListeners();
    } catch (e) {
      print('Erreur lors du chargement des préférences de thème: $e');
    }
  }
}