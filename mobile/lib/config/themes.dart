import 'package:flutter/material.dart';

class AppTheme {
  // Constantes de couleur pour les thèmes
  // Thème clair
  static const Color lightBgPrimary = Color(0xFFFFFFFF);
  static const Color lightBgSecondary = Color(0xFFF9FAFB);
  static const Color lightTextPrimary = Color(0xFF111827);
  static const Color lightTextSecondary = Color(0xFF4B5563);
  static const Color lightBorderColor = Color(0xFFE5E7EB);
  static const Color lightAccentColor = Color(0xFF2563EB);
  static const Color lightAccentHover = Color(0xFF1D4ED8);
  static const Color lightShadowColor = Color(0x1A000000); // rgba(0, 0, 0, 0.1)
  static const Color lightSidebarBg = Color(0xFFFFFFFF);
  static const Color lightCardBg = Color(0xFFFFFFFF);

  // Thème sombre
  static const Color darkBgPrimary = Color(0xFF1F2937);
  static const Color darkBgSecondary = Color(0xFF111827);
  static const Color darkTextPrimary = Color(0xFFF9FAFB);
  static const Color darkTextSecondary = Color(0xFFD1D5DB);
  static const Color darkBorderColor = Color(0xFF374151);
  static const Color darkAccentColor = Color(0xFF3B82F6);
  static const Color darkAccentHover = Color(0xFF60A5FA);
  static const Color darkShadowColor = Color(0x4D000000); // rgba(0, 0, 0, 0.3)
  static const Color darkSidebarBg = Color(0xFF111827);
  static const Color darkCardBg = Color(0xFF1F2937);

  // Thème bleu
  static const Color blueBgPrimary = Color(0xFFF0F9FF);
  static const Color blueBgSecondary = Color(0xFFE0F2FE);
  static const Color blueTextPrimary = Color(0xFF0C4A6E);
  static const Color blueTextSecondary = Color(0xFF0369A1);
  static const Color blueBorderColor = Color(0xFFBAE6FD);
  static const Color blueAccentColor = Color(0xFF0284C7);
  static const Color blueAccentHover = Color(0xFF0369A1);
  static const Color blueShadowColor =
      Color(0x1A0369A1); // rgba(3, 105, 161, 0.1)
  static const Color blueSidebarBg = Color(0xFFF0F9FF);
  static const Color blueCardBg = Color(0xFFFFFFFF);

  // Thème clair
  static final ThemeData lightTheme = ThemeData(
    useMaterial3: true,
    brightness: Brightness.light,
    scaffoldBackgroundColor: lightBgSecondary,
    colorScheme: const ColorScheme.light(
      primary: lightAccentColor,
      secondary: lightAccentHover,
      error: Color(0xFFB00020),
      background: lightBgSecondary,
      surface: lightBgPrimary,
      onPrimary: Colors.white,
      onSecondary: Colors.white,
      onSurface: lightTextPrimary,
      onBackground: lightTextPrimary,
      onError: Colors.white,
    ),
    textTheme: const TextTheme(
      titleLarge: TextStyle(
        color: lightTextPrimary,
        fontSize: 20,
        fontWeight: FontWeight.bold,
      ),
      titleMedium: TextStyle(
        color: lightTextPrimary,
        fontSize: 16,
        fontWeight: FontWeight.w600,
      ),
      bodyLarge: TextStyle(
        color: lightTextPrimary,
        fontSize: 16,
      ),
      bodyMedium: TextStyle(
        color: lightTextSecondary,
        fontSize: 14,
      ),
    ),
    appBarTheme: const AppBarTheme(
      elevation: 0,
      backgroundColor: lightBgPrimary,
      foregroundColor: lightTextPrimary,
      shadowColor: lightShadowColor,
    ),
    elevatedButtonTheme: ElevatedButtonThemeData(
      style: ElevatedButton.styleFrom(
        foregroundColor: Colors.white,
        backgroundColor: lightAccentColor,
        padding: const EdgeInsets.symmetric(vertical: 12, horizontal: 24),
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
      ),
    ),
    cardTheme: CardTheme(
      elevation: 2,
      color: lightCardBg,
      shadowColor: lightShadowColor,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(12),
        side: BorderSide(color: lightBorderColor),
      ),
    ),
    inputDecorationTheme: InputDecorationTheme(
      filled: true,
      fillColor: lightBgPrimary,
      border: OutlineInputBorder(
        borderRadius: BorderRadius.circular(8),
        borderSide: BorderSide(color: lightBorderColor),
      ),
      enabledBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(8),
        borderSide: BorderSide(color: lightBorderColor),
      ),
      focusedBorder: OutlineInputBorder(
        borderSide: BorderSide(color: lightAccentColor, width: 2),
        borderRadius: BorderRadius.circular(8),
      ),
      labelStyle: TextStyle(color: lightTextSecondary),
    ),
    dividerTheme: DividerThemeData(
      color: lightBorderColor,
      thickness: 1,
    ),
  );

  // Thème sombre
  static final ThemeData darkTheme = ThemeData(
    useMaterial3: true,
    brightness: Brightness.dark,
    scaffoldBackgroundColor: darkBgSecondary,
    colorScheme: const ColorScheme.dark(
      primary: darkAccentColor,
      secondary: darkAccentHover,
      error: Color(0xFFCF6679),
      background: darkBgSecondary,
      surface: darkBgPrimary,
      onPrimary: Colors.white,
      onSecondary: Colors.white,
      onSurface: darkTextPrimary,
      onBackground: darkTextPrimary,
      onError: Colors.white,
    ),
    textTheme: const TextTheme(
      titleLarge: TextStyle(
        color: darkTextPrimary,
        fontSize: 20,
        fontWeight: FontWeight.bold,
      ),
      titleMedium: TextStyle(
        color: darkTextPrimary,
        fontSize: 16,
        fontWeight: FontWeight.w600,
      ),
      bodyLarge: TextStyle(
        color: darkTextPrimary,
        fontSize: 16,
      ),
      bodyMedium: TextStyle(
        color: darkTextSecondary,
        fontSize: 14,
      ),
    ),
    appBarTheme: const AppBarTheme(
      elevation: 0,
      backgroundColor: darkBgPrimary,
      foregroundColor: darkTextPrimary,
      shadowColor: darkShadowColor,
    ),
    elevatedButtonTheme: ElevatedButtonThemeData(
      style: ElevatedButton.styleFrom(
        foregroundColor: Colors.white,
        backgroundColor: darkAccentColor,
        padding: const EdgeInsets.symmetric(vertical: 12, horizontal: 24),
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
      ),
    ),
    cardTheme: CardTheme(
      elevation: 4,
      color: darkCardBg,
      shadowColor: darkShadowColor,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(12),
        side: BorderSide(color: darkBorderColor),
      ),
    ),
    inputDecorationTheme: InputDecorationTheme(
      filled: true,
      fillColor: darkBgPrimary,
      border: OutlineInputBorder(
        borderRadius: BorderRadius.circular(8),
        borderSide: BorderSide(color: darkBorderColor),
      ),
      enabledBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(8),
        borderSide: BorderSide(color: darkBorderColor),
      ),
      focusedBorder: OutlineInputBorder(
        borderSide: BorderSide(color: darkAccentColor, width: 2),
        borderRadius: BorderRadius.circular(8),
      ),
      labelStyle: TextStyle(color: darkTextSecondary),
    ),
    dividerTheme: DividerThemeData(
      color: darkBorderColor,
      thickness: 1,
    ),
  );

  // Thème bleu
  static final ThemeData blueTheme = ThemeData(
    useMaterial3: true,
    brightness: Brightness.light,
    scaffoldBackgroundColor: blueBgSecondary,
    colorScheme: const ColorScheme.light(
      primary: blueAccentColor,
      secondary: blueAccentHover,
      error: Color(0xFFB00020),
      background: blueBgSecondary,
      surface: blueBgPrimary,
      onPrimary: Colors.white,
      onSecondary: Colors.white,
      onSurface: blueTextPrimary,
      onBackground: blueTextPrimary,
      onError: Colors.white,
    ),
    textTheme: const TextTheme(
      titleLarge: TextStyle(
        color: blueTextPrimary,
        fontSize: 20,
        fontWeight: FontWeight.bold,
      ),
      titleMedium: TextStyle(
        color: blueTextPrimary,
        fontSize: 16,
        fontWeight: FontWeight.w600,
      ),
      bodyLarge: TextStyle(
        color: blueTextPrimary,
        fontSize: 16,
      ),
      bodyMedium: TextStyle(
        color: blueTextSecondary,
        fontSize: 14,
      ),
    ),
    appBarTheme: const AppBarTheme(
      elevation: 0,
      backgroundColor: blueBgPrimary,
      foregroundColor: blueTextPrimary,
      shadowColor: blueShadowColor,
    ),
    elevatedButtonTheme: ElevatedButtonThemeData(
      style: ElevatedButton.styleFrom(
        foregroundColor: Colors.white,
        backgroundColor: blueAccentColor,
        padding: const EdgeInsets.symmetric(vertical: 12, horizontal: 24),
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
      ),
    ),
    cardTheme: CardTheme(
      elevation: 2,
      color: blueCardBg,
      shadowColor: blueShadowColor,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(12),
        side: BorderSide(color: blueBorderColor),
      ),
    ),
    inputDecorationTheme: InputDecorationTheme(
      filled: true,
      fillColor: blueBgPrimary,
      border: OutlineInputBorder(
        borderRadius: BorderRadius.circular(8),
        borderSide: BorderSide(color: blueBorderColor),
      ),
      enabledBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(8),
        borderSide: BorderSide(color: blueBorderColor),
      ),
      focusedBorder: OutlineInputBorder(
        borderSide: BorderSide(color: blueAccentColor, width: 2),
        borderRadius: BorderRadius.circular(8),
      ),
      labelStyle: TextStyle(color: blueTextSecondary),
    ),
    dividerTheme: DividerThemeData(
      color: blueBorderColor,
      thickness: 1,
    ),
  );
}
