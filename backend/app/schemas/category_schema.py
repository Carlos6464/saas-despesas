# app/schemas/category_schema.py
from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from .user_schema import UserPublic 

# --- Schema Base ---
# Contém os campos comuns a todos os outros schemas para evitar repetição.
class CategoryBase(BaseModel):
    name: str

# --- Schema para Criação ---
# Usado para validar os dados ao criar uma nova categoria.
# Herda de CategoryBase, pois para criar, só precisamos do nome.
class CategoryCreate(CategoryBase):
    pass

# --- Schema para Atualização ---
# Usado ao atualizar uma categoria. Todos os campos são opcionais.
class CategoryUpdate(BaseModel):
    name: Optional[str] = None

# --- Schema para Exibição (Público) ---
# Define os campos que serão retornados pela API.
# Herda de CategoryBase e adiciona os campos que são gerados pelo banco de dados.
class CategoryPublic(CategoryBase):
    id: int
    user_id: Optional[int] = None
    created_at: datetime
    updated_at: Optional[datetime] = None

    owner: Optional[UserPublic] = None

    class Config:
        from_attributes = True # Permite que o Pydantic leia dados de objetos SQLAlchemy