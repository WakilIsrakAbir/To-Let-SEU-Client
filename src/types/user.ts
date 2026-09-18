export type UserRole = 'user' | 'moderator' | 'admin';

export type SEUDepartment =
  | 'CSE'
  | 'EEE'
  | 'BBA'
  | 'Textile Engineering'
  | 'English'
  | 'Law'
  | 'Pharmacy'
  | 'Economics'
  | 'Other';

export interface IUser {
  _id: string;
  name: string;
  email: string;
  phone: string;
  department: SEUDepartment;
  studentId?: string;
  avatarUrl?: string;
  role: UserRole;
  isVerifiedStudent: boolean;
  status: 'active' | 'suspended';
  createdAt: string;
}
