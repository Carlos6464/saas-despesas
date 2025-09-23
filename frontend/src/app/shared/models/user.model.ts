// Define a estrutura do objeto de usuário que vem da sua API
export interface User {
  id: number;
  email: string;
  name: string;
  is_active: boolean;
  is_admin: boolean;
}
