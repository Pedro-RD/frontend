import { Resident } from './resident';

export interface Message {
  id: number;
  content: string;
  createdAt: string;
  updatedAt: string;
  user: {
    id: number;
    email: string;
    name: string;
    role: string;
    profilePicture?: string; // Adicione esta linha para opcionalmente usar avatares personalizados
  };
  resident?: Resident;
}

export interface MessageDTO {
  content: string;
}
