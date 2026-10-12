// import client from '../service/network';

// export interface User {
//   id: string;
//   username: string;
//   password?: string;
//   role: 'ADMIN' | 'USER' | 'EDITOR' | 'VIEWER';
//   status: 'ACTIVE' | 'INACTIVE';
//   createdAt: string;
//   lastLogin?: string;
// }

// export const ADMIN_USER = {
//   id: 'admin-rocky',
//   username: 'rocky',
//   password: 'rawtv',
//   role: 'ADMIN',
//   status: 'ACTIVE',
//   createdAt: new Date().toISOString(),
// };

// const APP_USERS_KEY = 'app_users';

// class UserService {
//   getCurrentUser(): User | null {
//     const userStr = localStorage.getItem('currentUser');
//     if (userStr) {
//       try {
//         return JSON.parse(userStr);
//       } catch {
//         return null;
//       }
//     }
//     return null;
//   }

//   isAdmin(): boolean {
//     const user = this.getCurrentUser();
//     return user?.role === 'ADMIN';
//   }

//   async getAllUsers(): Promise<User[]> {
//     return this.getLocalUsers();
//   }

//   getUserByUsername(username: string): User | null {
//     const users = this.getLocalUsers();
//     return users.find(u => u.username === username) || null;
//   }

//   private getLocalUsers(): User[] {
//     const storedUsers = localStorage.getItem(APP_USERS_KEY);
//     const usersMap = new Map<string, User>();
    
//     usersMap.set(ADMIN_USER.username, {
//       id: ADMIN_USER.id,
//       username: ADMIN_USER.username,
//       password: ADMIN_USER.password,
//       role: 'ADMIN',
//       status: 'ACTIVE',
//       createdAt: ADMIN_USER.createdAt,
//       lastLogin: new Date().toISOString(),
//     });
    
//     if (storedUsers) {
//       const parsedUsers = JSON.parse(storedUsers);
//       parsedUsers.forEach((u: any) => {
//         const username = u.phoneNumber;
//         if (username !== ADMIN_USER.username && !usersMap.has(username)) {
//           usersMap.set(username, {
//             id: username,
//             username: username,
//             password: u.password,
//             role: u.role?.toUpperCase() || 'USER',
//             status: u.status || 'ACTIVE',
//             createdAt: u.createdAt || new Date().toISOString(),
//             lastLogin: u.lastLogin,
//           });
//         }
//       });
//     }
//     return Array.from(usersMap.values());
//   }

//   async createUser(user: Omit<User, 'id' | 'createdAt' | 'lastLogin'> & { password: string }): Promise<User> {
//     const existing = this.getUserByUsername(user.username);
//     if (existing) {
//       throw new Error('Username already exists!');
//     }

//     try {
//       await client.post('/auth/register', {
//         username: user.username,
//         password: user.password,
//         role: user.role.toLowerCase(),
//       });
//       console.log('Backend registration success');
//     } catch (err) {
//       console.warn('Backend registration not available, saving only locally.');
//     }

//     let existingUsersStr = localStorage.getItem(APP_USERS_KEY);
//     let existingUsers = existingUsersStr ? JSON.parse(existingUsersStr) : [];
//     existingUsers.push({
//       phoneNumber: user.username,
//       password: user.password,
//       name: user.username,
//       role: user.role.toLowerCase(),
//       status: 'ACTIVE',
//       createdAt: new Date().toISOString(),
//     });
//     localStorage.setItem(APP_USERS_KEY, JSON.stringify(existingUsers));

//     return {
//       id: user.username,
//       username: user.username,
//       password: user.password,
//       role: user.role,
//       status: 'ACTIVE',
//       createdAt: new Date().toISOString(),
//     };
//   }

//   // ✅ FIXED: updateUser now handles username, password, role, status
//   async updateUser(id: string, updates: Partial<User>): Promise<User> {
//     if (!this.isAdmin()) throw new Error('Only admins can update users');
//     if (id === ADMIN_USER.username && updates.status !== undefined) {
//       throw new Error('Cannot change admin user status');
//     }
    
//     const existingUsers = JSON.parse(localStorage.getItem(APP_USERS_KEY) || '[]');
//     let updatedUsers = [...existingUsers];
//     let userIndex = -1;
//     let oldPhoneNumber = id;

//     // Find the user by current phoneNumber (id)
//     for (let i = 0; i < updatedUsers.length; i++) {
//       if (updatedUsers[i].phoneNumber === id) {
//         userIndex = i;
//         break;
//       }
//     }
//     if (userIndex === -1) throw new Error('User not found');

//     const user = updatedUsers[userIndex];
//     const newPhoneNumber = updates.username || user.phoneNumber;

//     // Update fields
//     if (updates.role !== undefined) user.role = updates.role.toLowerCase();
//     if (updates.status !== undefined) user.status = updates.status;
//     if (updates.password !== undefined && updates.password.trim() !== '') {
//       user.password = updates.password;
//     }
//     if (updates.username !== undefined && updates.username !== user.phoneNumber) {
//       user.phoneNumber = updates.username;
//     }

//     updatedUsers[userIndex] = user;

//     // If username changed, we need to replace the entry (remove old, add new)
//     if (updates.username && updates.username !== oldPhoneNumber) {
//       // Remove old entry and add a new one with new phoneNumber
//       updatedUsers = updatedUsers.filter(u => u.phoneNumber !== oldPhoneNumber);
//       updatedUsers.push(user);
//     }

//     localStorage.setItem(APP_USERS_KEY, JSON.stringify(updatedUsers));
    
//     return {
//       id: user.phoneNumber,
//       username: user.phoneNumber,
//       password: user.password,
//       role: user.role?.toUpperCase(),
//       status: user.status,
//       createdAt: user.createdAt,
//       lastLogin: user.lastLogin,
//     } as User;
//   }

//   async deleteUser(id: string): Promise<void> {
//     if (!this.isAdmin()) throw new Error('Only admins can delete users');
//     if (id === ADMIN_USER.username) throw new Error('Cannot delete admin user');
//     const existingUsers = JSON.parse(localStorage.getItem(APP_USERS_KEY) || '[]');
//     const filteredUsers = existingUsers.filter((u: any) => u.phoneNumber !== id);
//     localStorage.setItem(APP_USERS_KEY, JSON.stringify(filteredUsers));
//   }
// }

// export default new UserService();

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

const APP_USERS_KEY = 'app_users';

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

  // ✅ FETCH FROM BACKEND API (with localStorage fallback)
  async getAllUsers(): Promise<User[]> {
    try {
      const response = await client.get('/user/all');
      const backendUsers = (response.data || []).map((u: any) => {
        // Authorities list se role extract karo
        const authorities: string[] = u.authorities || [];
        let role: 'ADMIN' | 'USER' | 'EDITOR' | 'VIEWER' = 'USER';
        if (authorities.includes('ADMIN')) role = 'ADMIN';
        else if (authorities.includes('EDITOR')) role = 'EDITOR';
        else if (authorities.includes('USER')) role = 'USER';

        return {
          id: u.id || u._id,
          username: u.phoneNumber || u.name || 'unknown',
          role: role,
          status: 'ACTIVE' as const,
          createdAt: u.createdAt || new Date().toISOString(),
          lastLogin: u.lastLogin,
        };
      });

      // Local admin user tho merge cheyyi
      const adminUser: User = {
        id: ADMIN_USER.id,
        username: ADMIN_USER.username,
        password: ADMIN_USER.password,
        role: 'ADMIN' as const,
        status: 'ACTIVE' as const,
        createdAt: ADMIN_USER.createdAt,
        lastLogin: new Date().toISOString(),
      };

      // Deduplicate by username
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
      console.warn('Backend users API unavailable, using localStorage fallback', error);
      return this.getLocalUsers();
    }
  }

  getUserByUsername(username: string): User | null {
    const users = this.getLocalUsers();
    return users.find(u => u.username === username) || null;
  }

  private getLocalUsers(): User[] {
    const storedUsers = localStorage.getItem(APP_USERS_KEY);
    const usersMap = new Map<string, User>();

    usersMap.set(ADMIN_USER.username, {
      id: ADMIN_USER.id,
      username: ADMIN_USER.username,
      password: ADMIN_USER.password,
      role: 'ADMIN',
      status: 'ACTIVE',
      createdAt: ADMIN_USER.createdAt,
      lastLogin: new Date().toISOString(),
    });

    if (storedUsers) {
      const parsedUsers = JSON.parse(storedUsers);
      parsedUsers.forEach((u: any) => {
        const username = u.phoneNumber;
        if (username !== ADMIN_USER.username && !usersMap.has(username)) {
          usersMap.set(username, {
            id: username,
            username: username,
            password: u.password,
            role: u.role?.toUpperCase() || 'USER',
            status: u.status || 'ACTIVE',
            createdAt: u.createdAt || new Date().toISOString(),
            lastLogin: u.lastLogin,
          });
        }
      });
    }
    return Array.from(usersMap.values());
  }

  async createUser(user: Omit<User, 'id' | 'createdAt' | 'lastLogin'> & { password: string }): Promise<User> {
    const existing = this.getUserByUsername(user.username);
    if (existing) {
      throw new Error('Username already exists!');
    }

    try {
      await client.post('/auth/register', {
        username: user.username,
        password: user.password,
        role: user.role.toLowerCase(),
      });
      console.log('Backend registration success');
    } catch (err) {
      console.warn('Backend registration not available, saving only locally.');
    }

    let existingUsersStr = localStorage.getItem(APP_USERS_KEY);
    let existingUsers = existingUsersStr ? JSON.parse(existingUsersStr) : [];
    existingUsers.push({
      phoneNumber: user.username,
      password: user.password,
      name: user.username,
      role: user.role.toLowerCase(),
      status: 'ACTIVE',
      createdAt: new Date().toISOString(),
    });
    localStorage.setItem(APP_USERS_KEY, JSON.stringify(existingUsers));

    return {
      id: user.username,
      username: user.username,
      password: user.password,
      role: user.role,
      status: 'ACTIVE',
      createdAt: new Date().toISOString(),
    };
  }

  async updateUser(id: string, updates: Partial<User>): Promise<User> {
    if (!this.isAdmin()) throw new Error('Only admins can update users');
    if (id === ADMIN_USER.username && updates.status !== undefined) {
      throw new Error('Cannot change admin user status');
    }

    const existingUsers = JSON.parse(localStorage.getItem(APP_USERS_KEY) || '[]');
    let updatedUsers = [...existingUsers];
    let userIndex = -1;
    let oldPhoneNumber = id;

    for (let i = 0; i < updatedUsers.length; i++) {
      if (updatedUsers[i].phoneNumber === id) {
        userIndex = i;
        break;
      }
    }
    if (userIndex === -1) throw new Error('User not found');

    const user = updatedUsers[userIndex];
    const newPhoneNumber = updates.username || user.phoneNumber;

    if (updates.role !== undefined) user.role = updates.role.toLowerCase();
    if (updates.status !== undefined) user.status = updates.status;
    if (updates.password !== undefined && updates.password.trim() !== '') {
      user.password = updates.password;
    }
    if (updates.username !== undefined && updates.username !== user.phoneNumber) {
      user.phoneNumber = updates.username;
    }

    updatedUsers[userIndex] = user;

    if (updates.username && updates.username !== oldPhoneNumber) {
      updatedUsers = updatedUsers.filter(u => u.phoneNumber !== oldPhoneNumber);
      updatedUsers.push(user);
    }

    localStorage.setItem(APP_USERS_KEY, JSON.stringify(updatedUsers));

    return {
      id: user.phoneNumber,
      username: user.phoneNumber,
      password: user.password,
      role: user.role?.toUpperCase(),
      status: user.status,
      createdAt: user.createdAt,
      lastLogin: user.lastLogin,
    } as User;
  }

  async deleteUser(id: string): Promise<void> {
    if (!this.isAdmin()) throw new Error('Only admins can delete users');
    if (id === ADMIN_USER.username) throw new Error('Cannot delete admin user');
    const existingUsers = JSON.parse(localStorage.getItem(APP_USERS_KEY) || '[]');
    const filteredUsers = existingUsers.filter((u: any) => u.phoneNumber !== id);
    localStorage.setItem(APP_USERS_KEY, JSON.stringify(filteredUsers));
  }
}

export default new UserService();
