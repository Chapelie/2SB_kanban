import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'dart:math' as math;
import '../../config/app_routes.dart';
import '../../widgets/onboarding/animated_card.dart';
import '../../widgets/onboarding/animated_indicator.dart';

class OnboardingScreen extends StatefulWidget {
  const OnboardingScreen({Key? key}) : super(key: key);

  @override
  State<OnboardingScreen> createState() => _OnboardingScreenState();
}

class _OnboardingScreenState extends State<OnboardingScreen>
    with TickerProviderStateMixin {
  late PageController _pageController;
  late AnimationController _cardAnimationController;
  late AnimationController _imageAnimationController;
  late AnimationController _textAnimationController;
  late Animation<double> _textAnimation;
  int _currentPage = 0;

  final List<Map<String, dynamic>> _onboardingData = [
    {
      'title': 'Bienvenue sur 2SB KANBAN',
      'description': 'Gérez vos projets efficacement avec notre système Kanban intuitif.',
      'image': 'assets/images/onboarding/kanban_board.png',
      'color': const Color(0xFF3F51B5),
      'iconData': Icons.dashboard_customize,
    },
    {
      'title': 'Organisez vos tâches',
      'description': 'Créez, organisez et suivez vos tâches en fonction de leur statut.',
      'image': 'assets/images/onboarding/task_management.png',
      'color': const Color(0xFF00BCD4),
      'iconData': Icons.task_alt,
    },
    {
      'title': 'Travaillez en équipe',
      'description': 'Collaborez avec votre équipe et attribuez des tâches facilement.',
      'image': 'assets/images/onboarding/team_work.png',
      'color': const Color(0xFF4CAF50),
      'iconData': Icons.people,
    },
    {
      'title': 'Suivez votre progression',
      'description': 'Visualisez votre avancement et adaptez vos projets en temps réel.',
      'image': 'assets/images/onboarding/progress_tracking.png',
      'color': const Color(0xFFF44336),
      'iconData': Icons.insights,
    },
  ];

  @override
  void initState() {
    super.initState();
    
    // Configuration du contrôleur de page
    _pageController = PageController();
    _pageController.addListener(_onPageChanged);
    
    // Configuration des animations
    _cardAnimationController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 700),
    );
    
    _imageAnimationController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 800),
    );
    
    _textAnimationController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 600),
    );
    
    _textAnimation = CurvedAnimation(
      parent: _textAnimationController,
      curve: Curves.easeInOut,
    );
    
    // Démarrer les animations à l'initialisation
    _startAnimations();
  }

  @override
  void dispose() {
    _pageController.dispose();
    _cardAnimationController.dispose();
    _imageAnimationController.dispose();
    _textAnimationController.dispose();
    super.dispose();
  }

  void _onPageChanged() {
    int page = _pageController.page?.round() ?? 0;
    if (_currentPage != page) {
      setState(() {
        _currentPage = page;
      });
      _startAnimations();
    }
  }

  void _startAnimations() {
    _cardAnimationController.reset();
    _imageAnimationController.reset();
    _textAnimationController.reset();
    
    Future.delayed(const Duration(milliseconds: 100), () {
      _cardAnimationController.forward();
      Future.delayed(const Duration(milliseconds: 200), () {
        _imageAnimationController.forward();
        Future.delayed(const Duration(milliseconds: 150), () {
          _textAnimationController.forward();
        });
      });
    });
  }

  Future<void> _completeOnboarding() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setBool('hasSeenOnboarding', true);

    if (!mounted) return;
    Navigator.pushReplacementNamed(context, AppRoutes.login);
  }

  void _nextPage() {
    if (_currentPage < _onboardingData.length - 1) {
      _pageController.animateToPage(
        _currentPage + 1,
        duration: const Duration(milliseconds: 500),
        curve: Curves.easeInOut,
      );
    } else {
      _completeOnboarding();
    }
  }

  @override
  Widget build(BuildContext context) {
    // Effet immersif en plein écran
    SystemChrome.setSystemUIOverlayStyle(SystemUiOverlayStyle(
      statusBarColor: Colors.transparent,
      statusBarIconBrightness: Brightness.light,
      systemNavigationBarColor: _onboardingData[_currentPage]['color'],
      systemNavigationBarIconBrightness: Brightness.light,
    ));

    final theme = Theme.of(context);
    final isDarkMode = theme.brightness == Brightness.dark;
    final size = MediaQuery.of(context).size;

    return Scaffold(
      body: Stack(
        children: [
          // Arrière-plan animé
          AnimatedContainer(
            duration: const Duration(milliseconds: 500),
            decoration: BoxDecoration(
              gradient: LinearGradient(
                begin: Alignment.topRight,
                end: Alignment.bottomLeft,
                colors: [
                  _onboardingData[_currentPage]['color'],
                  _onboardingData[_currentPage]['color'].withOpacity(0.7),
                ],
              ),
            ),
            child: Stack(
              children: [
                // Cercles décoratifs en arrière-plan
                Positioned(
                  top: -size.height * 0.15,
                  right: -size.width * 0.2,
                  child: Container(
                    width: size.width * 0.6,
                    height: size.width * 0.6,
                    decoration: BoxDecoration(
                      shape: BoxShape.circle,
                      color: Colors.white.withOpacity(0.1),
                    ),
                  ),
                ),
                Positioned(
                  bottom: -size.height * 0.1,
                  left: -size.width * 0.3,
                  child: Container(
                    width: size.width * 0.7,
                    height: size.width * 0.7,
                    decoration: BoxDecoration(
                      shape: BoxShape.circle,
                      color: Colors.white.withOpacity(0.1),
                    ),
                  ),
                ),
              ],
            ),
          ),

          // Contenu de la page
          SafeArea(
            child: Column(
              children: [
                Expanded(
                  child: PageView.builder(
                    controller: _pageController,
                    itemCount: _onboardingData.length,
                    itemBuilder: (context, index) {
                      return _buildOnboardingPage(
                        _onboardingData[index],
                        index == _currentPage,
                        size,
                        isDarkMode,
                      );
                    },
                  ),
                ),

                // Indicateurs de page et bouton suivant
                Container(
                  padding: const EdgeInsets.symmetric(
                      horizontal: 24.0, vertical: 40.0),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      // Indicateurs de page
                      Row(
                        children: List.generate(
                          _onboardingData.length,
                          (index) => AnimatedIndicator(
                            isActive: index == _currentPage,
                            color: Colors.white,
                          ),
                        ),
                      ),
                      
                      // Bouton suivant ou terminer
                      ElevatedButton(
                        onPressed: _nextPage,
                        style: ElevatedButton.styleFrom(
                          backgroundColor: Colors.white,
                          foregroundColor: _onboardingData[_currentPage]['color'],
                          padding: const EdgeInsets.symmetric(
                              horizontal: 32.0, vertical: 16.0),
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(30.0),
                          ),
                          elevation: 5,
                        ),
                        child: Text(
                          _currentPage < _onboardingData.length - 1
                              ? 'Suivant'
                              : 'Commencer',
                          style: TextStyle(
                            fontSize: 16,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildOnboardingPage(
    Map<String, dynamic> data,
    bool isCurrentPage,
    Size size,
    bool isDarkMode,
  ) {
    return Padding(
      padding: const EdgeInsets.all(24.0),
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          // Icône animée
          AnimatedBuilder(
            animation: _imageAnimationController,
            builder: (context, child) {
              return Transform.scale(
                scale: _imageAnimationController.value,
                child: Transform.rotate(
                  angle: (1 - _imageAnimationController.value) * 0.2,
                  child: AnimatedCard(
                    controller: _cardAnimationController,
                    iconData: data['iconData'],
                    color: data['color'],
                    size: size.width * 0.4,
                  ),
                ),
              );
            },
          ),
          
          const SizedBox(height: 40),
          
          // Titre animé
          FadeTransition(
            opacity: _textAnimation,
            child: SlideTransition(
              position: Tween<Offset>(
                begin: const Offset(0, 0.3),
                end: Offset.zero,
              ).animate(_textAnimation),
              child: Text(
                data['title'],
                textAlign: TextAlign.center,
                style: const TextStyle(
                  color: Colors.white,
                  fontSize: 28,
                  fontWeight: FontWeight.bold,
                ),
              ),
            ),
          ),
          
          const SizedBox(height: 16),
          
          // Description animée
          FadeTransition(
            opacity: _textAnimation,
            child: SlideTransition(
              position: Tween<Offset>(
                begin: const Offset(0, 0.5),
                end: Offset.zero,
              ).animate(_textAnimation),
              child: Text(
                data['description'],
                textAlign: TextAlign.center,
                style: TextStyle(
                  color: Colors.white.withOpacity(0.9),
                  fontSize: 16,
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
}