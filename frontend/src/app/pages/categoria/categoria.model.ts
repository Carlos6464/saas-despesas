import { User } from '../../shared/models/user.model';

export interface Categoria {
  name: string;
  id: number;
  createdAt?: string | null;
  updatedAt?: string | null;
  created_at_formatted?: string | null;
  updated_at_formated?: string | null;
  owner: User;
}

export interface CategoriaCreate {
  name: string;
  user_id?: number;
}

export interface CategoriaUpdate {
  name?: string;
}

export interface CategoriaPaginatedList {
  data: Categoria[]; // A lista de categorias da página atual
  total: number; // O número total de categorias
}
