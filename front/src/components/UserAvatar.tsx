import React from 'react';
interface UserAvatarProps {
  user: {
    name: string;
    avatar?: string;
    initials?: string;
  };
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const UserAvatar: React.FC<UserAvatarProps> = ({ user, size = 'md', className = '' }) => {
  
  const sizeClasses = {
    sm: 'w-6 h-6 text-xs',
    md: 'w-8 h-8 text-sm',
    lg: 'w-10 h-10 text-base',
  };

  // Si l'utilisateur a un avatar, l'afficher
  if (user.avatar && !user.avatar.includes('placeholder')) {
    return (
      <img 
        src={user.avatar} 
        alt={user.name} 
        className={`${sizeClasses[size]} rounded-full border border-[var(--bg-primary)] object-cover ${className}`}
      />
    );
  }
  
  // Sinon, afficher les initiales dans un cercle coloré
  // Générer une couleur basée sur le nom (pour la cohérence)
  const colors = ['bg-blue-500', 'bg-red-500', 'bg-green-500', 'bg-yellow-500', 'bg-purple-500', 'bg-pink-500'];
  const colorIndex = user.name.charCodeAt(0) % colors.length;
  const bgColor = colors[colorIndex];
  
  // Utiliser les initiales fournies ou les calculer à partir du nom
  const initials = user.initials || user.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  
  return (
    <div className={`${sizeClasses[size]} ${bgColor} rounded-full border border-[var(--bg-primary)] flex items-center justify-center text-white ${className}`}>
      {initials}
    </div>
  );
};

export default UserAvatar;