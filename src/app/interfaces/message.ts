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
    avatarUrl?: string;  // Adicione esta linha para opcionalmente usar avatares personalizados
  };
}


export interface MessageDTO {
  content: string;
}
