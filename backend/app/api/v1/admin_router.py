# app/api/v1/admin_router.py
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List

from app.db.database import get_db
# Importe a NOVA dependência de segurança e o repositório
from app.core.security import get_current_admin_user
from app.repositories.user_repository import UserRepository
from app.schemas.user_schema import UserPublic
from app.models.user_model import User

# Criamos um novo roteador com um prefixo para organizar as rotas de admin
router = APIRouter(prefix="/admin", tags=["Admin"])

@router.get("/users", response_model=List[UserPublic])
def read_all_users(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    # AQUI está a mágica: usamos a nova dependência para proteger a rota
    current_admin: User = Depends(get_current_admin_user)
):
    """
    Retorna uma lista de todos os usuários.
    Apenas usuários administradores podem acessar esta rota.
    """
    user_repo = UserRepository(db)
    users = user_repo.get_all_users(skip=skip, limit=limit)
    return users
