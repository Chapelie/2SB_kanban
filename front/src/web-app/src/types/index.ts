export interface AccountSettings {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface NotificationSettings {
  emailNotifications: boolean;
  smsNotifications: boolean;
  pushNotifications: boolean;
}

export interface ProfileSettings {
  name: string;
  avatar: string;
  bio?: string;
  location?: string;
}