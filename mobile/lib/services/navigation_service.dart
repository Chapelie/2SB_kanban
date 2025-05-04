class NavigationService {
  // Singleton pattern
  static final NavigationService _instance = NavigationService._internal();
  factory NavigationService() => _instance;
  NavigationService._internal();
  
  // Fonction pour stocker le callback de navigation
  Function(int)? navigateToTabFunction;
  
  // Méthode pour naviguer vers un onglet spécifique
  void navigateToTab(int index) {
    if (navigateToTabFunction != null) {
      navigateToTabFunction!(index);
    }
  }
}