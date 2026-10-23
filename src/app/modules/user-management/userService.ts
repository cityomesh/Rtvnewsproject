import client from '../service/network';

export interface User {
  id: string;
  username: string;
  password?: string;
  role: 'ADMIN' | 'USER' | 'EDITOR' | 'VIEWER';
  status: 'ACTIVE' | 'INACTIVE';
  createdAt: string;
  lastLogin?: string;
}

export const ADMIN_USER = {
  id: 'admin-rocky',
  username: 'rocky',
  password: 'rawtv',
  role: 'ADMIN',
  status: 'ACTIVE',
  createdAt: new Date().toISOString(),
};

// Convert backend user → frontend User
const mapBackendUser = (u: any): User => {
  // Use backend `role` field directly if present, else derive from authorities
  let role: 'ADMIN' | 'USER' | 'EDITOR' | 'VIEWER' = 'USER';
  if (u.role) {
    const r = String(u.role).toUpperCase();
    if (r === 'ADMIN' || r === 'EDITOR' || r === 'USER' || r === 'VIEWER') {
      role = r as any;
    }
  } else {
    const authorities: string[] = u.authorities || [];
    if (authorities.some((a: string) => a.toUpperCase() === 'ADMIN')) role = 'ADMIN';
    else if (authorities.some((a: string) => a.toUpperCase() === 'EDITOR')) role = 'EDITOR';
    else if (authorities.some((a: string) => a.toUpperCase() === 'USER')) role = 'USER';
  }

  return {
    id: u.id || u._id,
    username: u.phoneNumber || u.username || 'unknown',
    role,
    status: (u.status || 'ACTIVE') as any,
    createdAt: u.createdAt || new Date().toISOString(),
    lastLogin: u.lastLogin,
  };
};

class UserService {
  getCurrentUser(): User | null {
    const userStr = localStorage.getItem('currentUser');
    if (userStr) {
      try {
        return JSON.parse(userStr);
      } catch {
        return null;
      }
    }
    return null;
  }

  isAdmin(): boolean {
    const user = this.getCurrentUser();
    return user?.role === 'ADMIN';
  }

  // ✅ FETCH from backend
  async getAllUsers(): Promise<User[]> {
    try {
      const response = await client.get('/user/all');
      const backendUsers = (response.data || []).map(mapBackendUser);

      const adminUser: User = {
        id: ADMIN_USER.id,
        username: ADMIN_USER.username,
        role: 'ADMIN',
        status: 'ACTIVE',
        createdAt: ADMIN_USER.createdAt,
        lastLogin: new Date().toISOString(),
      };

      const seen = new Set<string>();
      const allUsers: User[] = [];
      for (const u of [adminUser, ...backendUsers]) {
        const key = u.username.toLowerCase();
        if (!seen.has(key)) {
          seen.add(key);
          allUsers.push(u);
        }
      }
      return allUsers;
    } catch (error) {
      console.warn('Backend users API unavailable', error);
      return [];
    }
  }

  // ✅ CREATE via backend
  async createUser(user: { username: string; password: string; role: string }): Promise<User> {
    try {
      const response = await client.post('/admin/user', {
        username: user.username,
        password: user.password,
        role: user.role.toUpperCase(),
        status: 'ACTIVE',
      });
      return mapBackendUser(response.data);
    } catch (error: any) {
      const msg =
        error?.response?.data?.message || error?.message || 'Failed to create user';
      throw new Error(msg);
    }
  }

  // ✅ UPDATE via backend
  async updateUser(id: string, updates: Partial<User>): Promise<User> {
    try {
      const body: any = {};
      if (updates.username) body.username = updates.username;
      if (updates.password) body.password = updates.password;
      if (updates.role) body.role = updates.role.toUpperCase();
      if (updates.status) body.status = updates.status;

      const encodedId = encodeURIComponent(id);
      const response = await client.put(`/admin/user/${encodedId}`, body);
      return mapBackendUser(response.data);
    } catch (error: any) {
      const msg =
        error?.response?.data?.message || error?.message || 'Failed to update user';
      throw new Error(msg);
    }
  }

  // ✅ DELETE via backend
  async deleteUser(id: string): Promise<void> {
    try {
      const encodedId = encodeURIComponent(id);
      await client.delete(`/admin/user/${encodedId}`);
    } catch (error: any) {
      const msg =
        error?.response?.data?.message || error?.message || 'Failed to delete user';
      throw new Error(msg);
    }
  }

  getUserByUsername(_username: string): User | null {
    // Deprecated – use getAllUsers
    return null;
  }
}

export default new UserService();
