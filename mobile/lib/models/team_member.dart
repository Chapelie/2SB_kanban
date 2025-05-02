class TeamMember {
  final String id;
  final String name;
  final String email; // Ajout du champ email manquant
  final String location;
  final String avatar;
  final String initials;
  
  const TeamMember({
    required this.id,
    required this.name,
    required this.email, // Ajout du champ email comme paramètre requis
    required this.location,
    required this.avatar,
    required this.initials,
  });
  
  // Créer un TeamMember à partir de JSON
  factory TeamMember.fromJson(Map<String, dynamic> json) {
    return TeamMember(
      id: json['id'] ?? '',
      name: json['name'] ?? '',
      email: json['email'] ?? '', // Lecture de l'email depuis le JSON
      location: json['location'] ?? '',
      avatar: json['avatar'] ?? '',
      initials: json['initials'] ?? '',
    );
  }
  
  // Convertir en JSON pour le stockage local
  Map<String, dynamic> toJson() => {
    'id': id,
    'name': name,
    'email': email, // Inclusion de l'email dans la sérialisation
    'location': location,
    'avatar': avatar,
    'initials': initials,
  };
}