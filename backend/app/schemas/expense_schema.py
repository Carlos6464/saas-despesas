# app/schemas/expense_schema.py
from pydantic import BaseModel, Field, computed_field
from typing import Optional
from datetime import datetime, date

# --- Schemas Aninhados para Respostas ---
# Reutilizamos a ideia de schemas aninhados para respostas limpas.
class CategoryInfo(BaseModel):
    id: int
    name: str

    class Config:
        from_attributes = True

class OwnerInfo(BaseModel):
    id: int
    name: str

    class Config:
        from_attributes = True

# --- Schemas Principais ---
class ExpenseBase(BaseModel):
    description: str
    due_date: date
    value: float = Field(..., gt=0, description="O valor da despesa, deve ser positivo")
    is_paid: bool = False
    transaction_type: int = Field(..., description="1 para crédito, -1 para débito")
    category_id: int

# --- Schema para Criação ---
# Usado para validar os dados ao criar uma nova despesa.
class ExpenseCreate(ExpenseBase):
    pass

# --- Schema para Atualização ---
# Usado ao atualizar uma despesa. Todos os campos são opcionais.
class ExpenseUpdate(BaseModel):
    description: Optional[str] = None
    value: Optional[float] = Field(None, gt=0, description="O valor da despesa, deve ser positivo")
    due_date: Optional[date] = None
    is_paid: Optional[bool] = None
    transaction_type: Optional[int] = None
    category_id: Optional[int] = None

# --- Schema para Exibição (Público) ---
# Define os campos que serão retornados pela API.
class ExpensePublic(ExpenseBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None
    value: float
    
    # Usamos os schemas aninhados para incluir os nomes
    category: Optional[CategoryInfo] = None
    owner: Optional[OwnerInfo] = None

    class Config:
        from_attributes = True