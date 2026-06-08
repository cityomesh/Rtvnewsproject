import client from "../service/network";

export interface CurrentUser {
  username: string;
  role: string;
  name?: string;
}

export const isAuthenticated = async () => {
  const localToken = localStorage.getItem('token');
  
  if (!localToken) {
    console.log("No token found");
    return false;
  }
  
  if (localToken && localToken.length > 0) {
    console.log("Token found, authentication successful");
    return true;
  }
  
  return false;
};

export function getToken(): string | null {
  return localStorage.getItem('token');
}

export function setToken(token: string): void {
  console.log("Setting token:", token.substring(0, 30) + "...");
  localStorage.setItem('token', token);
}

export function getCurrentUser(): CurrentUser | null {
  const userStr = localStorage.getItem('currentUser');
  if (userStr) {
    try {
      return JSON.parse(userStr);
    } catch (error) {
      console.error("Error parsing current user:", error);
      return null;
    }
  }
  return null;
}

export function setCurrentUser(user: CurrentUser): void {
  console.log("Setting current user:", user);
  localStorage.setItem('currentUser', JSON.stringify(user));
}

export function isAdmin(): boolean {
  const user = getCurrentUser();
  return user?.role === 'ADMIN';
}

export function getUserRole(): string {
  const user = getCurrentUser();
  return user?.role || 'USER';
}

export function getUsername(): string {
  const user = getCurrentUser();
  return user?.username || '';
}

export function signOut(): void {
  console.log("Signing out, clearing all auth data");
  localStorage.removeItem('token');
  localStorage.removeItem('currentUser');
  localStorage.removeItem('user');
  localStorage.removeItem('auth');
  localStorage.removeItem('kt-auth-react-v');
  window.location.href = '/login';
}
