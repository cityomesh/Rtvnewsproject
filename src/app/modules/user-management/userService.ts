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

//   private getLocalUsers(): User[] {
//     const storedUsers = localStorage.getItem('app_users');
//     const usersMap = new Map<string, User>();
    
//     // ఎప్పుడూ అడ్మిన్ ని చేర్చు
//     usersMap.set(ADMIN_USER.username, {
//       id: ADMIN_USER.id,
//       username: ADMIN_USER.username,
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
//             role: u.role?.toUpperCase() || 'USER',
//             status: 'ACTIVE',
//             createdAt: new Date().toISOString(),
//           });
//         }
//       });
//     }
//     return Array.from(usersMap.values());
//   }

//   async createUser(user: Omit<User, 'id' | 'createdAt' | 'lastLogin'>): Promise<User> {
//     // బ్యాకెండ్ రిజిస్ట్రేషన్ ప్రయత్నించు, కానీ విఫలమైతే లోకల్ స్టోరేజ్ లో సేవ్ చేయి
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

//     // లోకల్ స్టోరేజ్ లో సేవ్ చేయి
//     let existingUsersStr = localStorage.getItem('app_users');
//     let existingUsers = existingUsersStr ? JSON.parse(existingUsersStr) : [];
//     if (existingUsers.find((u: any) => u.phoneNumber === user.username)) {
//       throw new Error('Username already exists!');
//     }
//     existingUsers.push({
//       phoneNumber: user.username,
//       password: user.password,
//       name: user.username,
//       role: user.role.toLowerCase(),
//     });
//     localStorage.setItem('app_users', JSON.stringify(existingUsers));

//     return {
//       id: user.username,
//       username: user.username,
//       role: user.role,
//       status: 'ACTIVE',
//       createdAt: new Date().toISOString(),
//     };
//   }

//   async updateUser(id: string, user: Partial<User>): Promise<User> {
//     if (!this.isAdmin()) throw new Error('Only admins can update users');
//     const existingUsers = JSON.parse(localStorage.getItem('app_users') || '[]');
//     const updatedUsers = existingUsers.map((u: any) => {
//       if (u.phoneNumber === id) {
//         return { ...u, role: user.role?.toLowerCase() || u.role };
//       }
//       return u;
//     });
//     localStorage.setItem('app_users', JSON.stringify(updatedUsers));
//     return { id, ...user } as User;
//   }

//   async deleteUser(id: string): Promise<void> {
//     if (!this.isAdmin()) throw new Error('Only admins can delete users');
//     if (id === ADMIN_USER.username) throw new Error('Cannot delete admin user');
//     const existingUsers = JSON.parse(localStorage.getItem('app_users') || '[]');
//     const filteredUsers = existingUsers.filter((u: any) => u.phoneNumber !== id);
//     localStorage.setItem('app_users', JSON.stringify(filteredUsers));
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

// localStorage keys
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

  async getAllUsers(): Promise<User[]> {
    return this.getLocalUsers();
  }

  private getLocalUsers(): User[] {
    const storedUsers = localStorage.getItem(APP_USERS_KEY);
    const usersMap = new Map<string, User>();
    
    // ✅ Always add admin user (status is always ACTIVE)
    usersMap.set(ADMIN_USER.username, {
      id: ADMIN_USER.id,
      username: ADMIN_USER.username,
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
            role: u.role?.toUpperCase() || 'USER',
            status: u.status || 'ACTIVE',     // ✅ read status from storage
            createdAt: u.createdAt || new Date().toISOString(),
            lastLogin: u.lastLogin,
          });
        }
      });
    }
    return Array.from(usersMap.values());
  }

  async createUser(user: Omit<User, 'id' | 'createdAt' | 'lastLogin'>): Promise<User> {
    // Backend registration (best effort)
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

    // Local storage save
    let existingUsersStr = localStorage.getItem(APP_USERS_KEY);
    let existingUsers = existingUsersStr ? JSON.parse(existingUsersStr) : [];
    if (existingUsers.find((u: any) => u.phoneNumber === user.username)) {
      throw new Error('Username already exists!');
    }
    existingUsers.push({
      phoneNumber: user.username,
      password: user.password,
      name: user.username,
      role: user.role.toLowerCase(),
      status: 'ACTIVE',        // ✅ new user is ACTIVE by default
      createdAt: new Date().toISOString(),
    });
    localStorage.setItem(APP_USERS_KEY, JSON.stringify(existingUsers));

    return {
      id: user.username,
      username: user.username,
      role: user.role,
      status: 'ACTIVE',
      createdAt: new Date().toISOString(),
    };
  }

  // ✅ FIXED: updateUser now supports status and any other field
  async updateUser(id: string, updates: Partial<User>): Promise<User> {
    if (!this.isAdmin()) throw new Error('Only admins can update users');
    
    // Prevent status change for admin user
    if (id === ADMIN_USER.username && updates.status !== undefined) {
      throw new Error('Cannot change admin user status');
    }
    
    const existingUsers = JSON.parse(localStorage.getItem(APP_USERS_KEY) || '[]');
    const updatedUsers = existingUsers.map((u: any) => {
      if (u.phoneNumber === id) {
        // Update allowed fields: role, status, etc.
        const updated = { ...u };
        if (updates.role !== undefined) updated.role = updates.role.toLowerCase();
        if (updates.status !== undefined) updated.status = updates.status;
        return updated;
      }
      return u;
    });
    localStorage.setItem(APP_USERS_KEY, JSON.stringify(updatedUsers));
    
    // Return updated user object
    const updatedUser = updatedUsers.find((u: any) => u.phoneNumber === id);
    return {
      id: updatedUser.phoneNumber,
      username: updatedUser.phoneNumber,
      role: updatedUser.role?.toUpperCase(),
      status: updatedUser.status,
      createdAt: updatedUser.createdAt,
      lastLogin: updatedUser.lastLogin,
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
