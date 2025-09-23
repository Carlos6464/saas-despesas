# app/api/v1/category_router.py
from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from typing import List, Optional

from app.db.database import get_db
from app.core.security import get_current_user
from app.services.category_service import CategoryService
from app.schemas.category_schema import CategoryCreate, CategoryUpdate, CategoryPublic, CategoryListPublic
from app.models.user_model import User

router = APIRouter(prefix="/categories", tags=["Categories"])

@router.post("/", response_model=CategoryPublic, status_code=status.HTTP_201_CREATED)
def create_category(
    category: CategoryCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Cria uma nova categoria para o usuário autenticado.
    """
    service = CategoryService(db)
    return service.create_category_for_user(category_data=category, current_user=current_user)

@router.get("/", response_model=CategoryListPublic)
def read_categories(
    name: Optional[str] = None, # Parâmetro de filtro exposto na API
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Retorna uma lista paginada de categorias do usuário e públicas.
    Inclui o número total de registros e pode ser filtrada por nome.
    """
    service = CategoryService(db)
    # Passa o 'name' recebido da URL para o serviço
    return service.get_categories_for_user_and_public(
        current_user=current_user, name=name, skip=skip, limit=limit
    )

@router.get("/{category_id}", response_model=CategoryPublic)
def read_category(
    category_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Retorna uma categoria específica pelo seu ID.
    Apenas o dono da categoria pode acessá-la.
    """
    service = CategoryService(db)
    return service.get_category_by_id(category_id=category_id, current_user=current_user)

@router.patch("/{category_id}", response_model=CategoryPublic)
def update_category(
    category_id: int,
    category: CategoryUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Atualiza uma categoria existente.
    Apenas o dono da categoria pode atualizá-la.
    """
    service = CategoryService(db)
    return service.update_category(category_id=category_id, category_data=category, current_user=current_user)

@router.delete("/{category_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_category(
    category_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Deleta uma categoria.
    Apenas o dono da categoria pode deletá-la.
    """
    service = CategoryService(db)
    service.delete_category(category_id=category_id, current_user=current_user)
    return None # Retorna uma resposta vazia com status 204