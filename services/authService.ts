import { User, MapResult, UserData } from "../types";

// Chaves para o LocalStorage
const USERS_KEY = 'terapeuta_users';
const MAPS_KEY = 'terapeuta_maps';
const SESSION_KEY = 'terapeuta_session';

// Funções utilitárias com tratamento de erro
const safeGetItem = (key: string): string | null => {
  try {
    return localStorage.getItem(key);
  } catch (e) {
    console.error("Erro ao acessar LocalStorage:", e);
    return null;
  }
};

const safeSetItem = (key: string, value: string): void => {
  try {
    localStorage.setItem(key, value);
  } catch (e) {
    console.error("Erro ao salvar no LocalStorage:", e);
  }
};

const safeRemoveItem = (key: string): void => {
  try {
    localStorage.removeItem(key);
  } catch (e) {
    console.error("Erro ao remover do LocalStorage:", e);
  }
};

const getDBUsers = (): User[] => {
  const users = safeGetItem(USERS_KEY);
  return users ? JSON.parse(users) : [];
};

const getDBMaps = (): Record<string, MapResult> => {
  const maps = safeGetItem(MAPS_KEY);
  return maps ? JSON.parse(maps) : {};
};

const saveDBUsers = (users: User[]) => {
  safeSetItem(USERS_KEY, JSON.stringify(users));
};

const saveDBMaps = (maps: Record<string, MapResult>) => {
  safeSetItem(MAPS_KEY, JSON.stringify(maps));
};

// Serviço Exportável
export const authService = {
  login: async (email: string, password: string): Promise<User> => {
    await new Promise(resolve => setTimeout(resolve, 800));
    const users = getDBUsers();
    const user = users.find(u => u.email === email);
    
    if (!user) throw new Error("Usuário não encontrado.");
    
    // Simplificação para demo: se for admin ou senha > 3 chars
    if (user.role === 'admin' && email === 'admin@terapeuta.com') {
       // ok
    } else if (password.length < 3) {
       throw new Error("Senha incorreta.");
    }

    safeSetItem(SESSION_KEY, JSON.stringify(user));
    return user;
  },

  loginGoogleAdmin: async (): Promise<User> => {
    await new Promise(resolve => setTimeout(resolve, 1500));
    const users = getDBUsers();
    let admin = users.find(u => u.role === 'admin');
    
    if (!admin) {
      admin = {
        id: 'admin-master',
        fullName: 'Administrador Master',
        email: 'admin@terapeuta.com',
        role: 'admin',
        createdAt: new Date().toISOString()
      };
      users.push(admin);
      saveDBUsers(users);
    }
    
    safeSetItem(SESSION_KEY, JSON.stringify(admin));
    return admin;
  },

  register: async (data: UserData & { password: string }): Promise<User> => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    const users = getDBUsers();

    if (users.some(u => u.email === data.email)) {
      throw new Error("E-mail já cadastrado.");
    }
    if (users.some(u => u.cpf === data.cpf)) {
      throw new Error("CPF já possui um cadastro.");
    }

    const newUser: User = {
      id: Date.now().toString(),
      fullName: data.fullName,
      email: data.email || '',
      cpf: data.cpf,
      birthDate: data.birthDate,
      role: 'client',
      createdAt: new Date().toISOString()
    };

    users.push(newUser);
    saveDBUsers(users);
    safeSetItem(SESSION_KEY, JSON.stringify(newUser));
    
    return newUser;
  },

  logout: () => {
    safeRemoveItem(SESSION_KEY);
  },

  getCurrentUser: (): User | null => {
    const session = safeGetItem(SESSION_KEY);
    return session ? JSON.parse(session) : null;
  },

  saveUserMap: (userId: string, map: MapResult) => {
    const maps = getDBMaps();
    maps[userId] = map;
    saveDBMaps(maps);
  },

  getUserMap: (userId: string): MapResult | null => {
    const maps = getDBMaps();
    return maps[userId] || null;
  },

  getAllUsers: (): User[] => {
    return getDBUsers().filter(u => u.role === 'client');
  },

  getStats: () => {
    const users = getDBUsers().filter(u => u.role === 'client');
    const maps = getDBMaps();
    return {
      totalUsers: users.length,
      totalMaps: Object.keys(maps).length
    };
  }
};
