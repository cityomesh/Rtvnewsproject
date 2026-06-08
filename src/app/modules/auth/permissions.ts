import { getCurrentUser, isAdmin } from './session';

// Check if current user can delete content
export const canDeleteContent = (contentCreatedBy?: string): boolean => {
  const currentUser = getCurrentUser();
  const isAdminUser = isAdmin();
  
  // Admin can delete anything
  if (isAdminUser) return true;
  
  // Normal users can only delete their own content
  if (contentCreatedBy && currentUser?.username === contentCreatedBy) return true;
  
  return false;
};

// Check if current user can edit content
export const canEditContent = (contentCreatedBy?: string): boolean => {
  const currentUser = getCurrentUser();
  const isAdminUser = isAdmin();
  
  // Admin can edit anything
  if (isAdminUser) return true;
  
  // Normal users can only edit their own content
  if (contentCreatedBy && currentUser?.username === contentCreatedBy) return true;
  
  return false;
};

// Get current user role
export const getUserRole = (): string => {
  const currentUser = getCurrentUser();
  return currentUser?.role || 'USER';
};
