
export enum AppStage {
  SPLASH = 'SPLASH',
  AUTH_LOGIN = 'AUTH_LOGIN',
  AUTH_REGISTER = 'AUTH_REGISTER',
  AUTH_ADMIN = 'AUTH_ADMIN',
  ADMIN_DASHBOARD = 'ADMIN_DASHBOARD',
  WELCOME = 'WELCOME',
  CHAT_CONSULTATION = 'CHAT_CONSULTATION',
  PRE_MAP_EDUCATION = 'PRE_MAP_EDUCATION',
  MAP_GENERATION = 'MAP_GENERATION',
  MY_MAP = 'MY_MAP',
  FAMILY_MAP = 'FAMILY_MAP',
  EXERCISES = 'EXERCISES',
  BOOKING = 'BOOKING'
}

export type UserRole = 'client' | 'admin';

export interface User {
  id: string;
  fullName: string;
  email: string;
  cpf?: string; // Admin might not have CPF
  birthDate?: string;
  role: UserRole;
  createdAt: string;
}

export interface TarotCard {
  number: number;
  name: string;
  image: string; // URL
  keywords: string[];
  quote: string; // The "Sou..." or first person text
  archetypeDefinition: string; // The theoretical explanation
  meaningInMap?: string; // Contextual meaning based on position
}

export interface MapPosition {
  id: number;
  title: string;
  period: string;
  description: string;
  card: TarotCard | null;
}

export interface UserData {
  fullName: string;
  birthDate: string; // YYYY-MM-DD
  cpf: string;
  email?: string;
  phone?: string;
}

export interface MapResult {
  arcano1: number; // Bagagem (0-13)
  arcano2: number; // Momento nascimento/Infancia (13-25)
  arcano3: number; // Personalidade (25-35)
  arcano4: number; // Maturidade (35-45)
  arcano5: number; // Proposito (45+)
  soulArcane: number; // Anseio da Alma
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
}

export interface FamilyMember {
  role: 'Pai' | 'Mãe' | 'Parceiro(a)' | 'Filho(a)';
  name: string;
}
