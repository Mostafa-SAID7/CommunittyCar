export interface User {
  id: string;
  email: string;
  name: string;
  roles: string[];
  avatar?: string;
  phone?: string;
  address?: Address;
  preferences?: UserPreferences;
  createdAt: Date;
  updatedAt: Date;
}

export interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface UserPreferences {
  theme: 'light' | 'dark';
  language: string;
  notifications: boolean;
}