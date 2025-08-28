// User-related TypeScript interfaces

export interface UserProfile {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  dateOfBirth?: string;
  gender?: 'Male' | 'Female' | 'Other';
  profilePictureUrl?: string;
  isEmailVerified: boolean;
  createdAt: string;
  updatedAt: string;
  roles: string[];
}

export interface UserProfileResponse {
  success: boolean;
  message: string;
  data: UserProfile;
}

export interface UpdateUserResponse {
  success: boolean;
  message: string;
  data?: UserProfile;
}

export interface ChangePasswordResponse {
  success: boolean;
  message: string;
}

// Re-export the User interface from auth store for compatibility
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  dateOfBirth?: string;
  gender?: 0 | 1; // Backend uses 0/1 for Male/Female
  emailConfirmed?: boolean;
  createdDate?: string;
  roles: string[];
}
