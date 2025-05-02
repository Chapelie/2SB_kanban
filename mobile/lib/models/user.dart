class User {
  final String id;
  final String name;
  final String email;
  final String location;
  final String avatar;
  final String initials;
  final String? role;
  
  const User({
    required this.id,
    required this.name,
    required this.email,
    this.location = '',
    this.avatar = '',
    this.initials = '',
    this.role,
  });
  
  // Créer un User à partir de JSON
  factory User.fromJson(Map<String, dynamic> json) {
    return User(
      id: json['id'] ?? '',
      name: json['name'] ?? '',
      email: json['email'] ?? '',
      location: json['location'] ?? '',
      avatar: json['avatar'] ?? '',
      initials: json['initials'] ?? '',
      role: json['role'],
    );
  }
  
  // Convertir en JSON pour le stockage local
  Map<String, dynamic> toJson() => {
    'id': id,
    'name': name,
    'email': email,
    'location': location,
    'avatar': avatar,
    'initials': initials,
    'role': role,
  };
}