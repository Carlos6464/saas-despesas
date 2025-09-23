# app/schemas/category_schema.py
from pydantic import BaseModel, computed_field
from typing import Optional, List
from datetime import datetime
from .user_schema import UserPublic 

# --- Schema Base ---
class CategoryBase(BaseModel):
    name: str
    user_id: Optional[int] = None

# --- Schema para Criação ---
class CategoryCreate(CategoryBase):
    pass

# --- Schema para Atualização ---
class CategoryUpdate(BaseModel):
    name: Optional[str] = None
    user_id: Optional[int] = None

# --- Schema para Exibição (Público) ---
class CategoryPublic(CategoryBase):
    id: int
    user_id: Optional[int] = None
    created_at: datetime
    updated_at: Optional[datetime] = None
    owner: Optional[UserPublic] = None

    # --- CAMPO COMPUTADO PARA A DATA DE CRIAÇÃO ---
    @computed_field
    @property
    def created_at_formatted(self) -> str:
        """Retorna a data de criação formatada como DD/MM/YYYY HH:MM."""
        return self.created_at.strftime("%d/%m/%Y %H:%M")

    # --- CAMPO COMPUTADO PARA A DATA DE ATUALIZAÇÃO ---
    @computed_field
    @property
    def updated_at_formatted(self) -> Optional[str]:
        """Retorna a data de atualização formatada, se existir."""
        if self.updated_at:
            return self.updated_at.strftime("%d/%m/%Y %H:%M")
        return None

    class Config:
        from_attributes = True
        
class CategoryListPublic(BaseModel):
    data: List[CategoryPublic]
    total: int