
import { User, MapResult, UserData } from "../types";

// Chaves para o LocalStorage
const USERS_KEY = 'terapeuta_users';
const MAPS_KEY = 'terapeuta_maps';
const SESSION_KEY = 'terapeuta_session';

// Simulação de Banco de Dados
const getDBUsers = (): User[] => {
  const users = localStorage.getItem(USERS_KEY);
  return users ? JSON.parse(users) : [];
};

const getDBMaps = (): Record<string, MapResult> => {
  const maps = localStorage.getItem(MAPS_KEY);
  return maps ? JSON.parse(maps) : {};
};

const saveDBUsers = (users: User[]) => {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
};

const saveDBMaps = (maps: Record<string, MapResult>) => {
  localStorage.setItem(MAPS_KEY, JSON.stringify(maps));
};

// Serviço Exportável
export const authService = {
  // --- AUTHENTICATION ---

  login: async (email: string, password: string): Promise<User> => {
    // Simula delay de rede
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const users = getDBUsers();
    // Simulação simplificada: senha é checada (na vida real usaríamos hash)
    // Aqui assumimos que para fins de demo, qualquer senha > 3 chars serve se o email bater
    const user = users.find(u => u.email === email);
    
    if (!user) throw new Error("Usuário não encontrado.");
    
    // Admin mockado
    if (user.role === 'admin' && email === 'admin@terapeuta.com') {
       // Sucesso admin
    } else if (password.length < 3) {
       throw new Error("Senha incorreta.");
    }

    localStorage.setItem(SESSION_KEY, JSON.stringify(user));
    return user;
  },

  loginGoogleAdmin: async (): Promise<User> => {
    await new Promise(resolve => setTimeout(resolve, 1500));
    // Cria um admin mockado se não existir
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
    
    localStorage.setItem(SESSION_KEY, JSON.stringify(admin));
    return admin;
  },

  register: async (data: UserData & { password: string }): Promise<User> => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    const users = getDBUsers();

    // Validações de Unicidade
    if (users.some(u => u.email === data.email)) {
      throw new Error("E-mail já cadastrado.");
    }
    if (users.some(u => u.cpf === data.cpf)) {
      throw new Error("CPF já possui um cadastro e um Mapa vinculado.");
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
    
    localStorage.setItem(SESSION_KEY, JSON.stringify(newUser));
    return newUser;
  },

  logout: () => {
    localStorage.removeItem(SESSION_KEY);
  },

  getCurrentUser: (): User | null => {
    const session = localStorage.getItem(SESSION_KEY);
    return session ? JSON.parse(session) : null;
  },

  // --- DATABASE OPERATIONS ---

  saveUserMap: (userId: string, map: MapResult) => {
    const maps = getDBMaps();
    maps[userId] = map;
    saveDBMaps(maps);
  },

  getUserMap: (userId: string): MapResult | null => {
    const maps = getDBMaps();
    return maps[userId] || null;
  },

  // --- ADMIN OPERATIONS ---
  
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
