# app/services/category_service.py
from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from typing import List

from app.repositories.category_repository import CategoryRepository
from app.schemas.category_schema import CategoryCreate, CategoryUpdate
from app.models.user_model import User

class CategoryService:
    def __init__(self, db: Session):
        """
        Inicializa o serviço com a sessão do banco de dados e o repositório.
        """
        self.db = db
        self.repository = CategoryRepository(db)

    def create_category_for_user(self, category_data: CategoryCreate, current_user: User):
        """
        Cria uma nova categoria caso o usuario seja admin não associa ela a um usuário.
        """
        if current_user.is_admin:
            return self.repository.create(category=category_data, user_id=None)
        else:
            return self.repository.create(category=category_data, user_id=current_user.id)
        

    def get_category_by_id(self, category_id: int, current_user: User):
        """
        Busca uma categoria pelo ID, garantindo que ela pertença ao usuário logado.
        """
        category = self.repository.get_by_id(category_id)
        if not category:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Categoria não encontrada."
            )
        if category.user_id != current_user.id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Você não tem permissão para acessar este recurso."
            )
        return category

    def get_all_categories_for_user(self, current_user: User, skip: int = 0, limit: int = 100):
        """
        Retorna todas as categorias pertencentes ao usuário logado.
        """
        return self.repository.get_by_user_id(user_id=current_user.id, skip=skip, limit=limit)
    
    def get_categories_for_user_and_public( self, current_user: User, skip: int = 0, limit: int = 100):
        """
        Retorna uma lista de categorias que:
        1. Pertencem ao usuário atual.
        2. São públicas (user_id é NULL).
        """
        return self.repository.get_categories_for_user_and_public(user_id=current_user.id, skip=skip, limit=limit)


    def update_category(self, category_id: int, category_data: CategoryUpdate, current_user: User):
        """
        Atualiza uma categoria, garantindo que ela pertença ao usuário logado.
        """
        category_to_update = self.get_category_by_id(category_id, current_user) # Reutiliza a lógica de verificação
        return self.repository.update(category_id=category_to_update.id, category_data=category_data)

    def delete_category(self, category_id: int, current_user: User):
        """
        Deleta uma categoria, garantindo que ela pertença ao usuário logado.
        """
        category_to_delete = self.get_category_by_id(category_id, current_user) # Reutiliza a lógica de verificação
        return self.repository.delete(category_id=category_to_delete.id)