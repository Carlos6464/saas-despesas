# app/schemas/user_schema.py
from pydantic import BaseModel, EmailStr

# Schema para receber dados na criação de um usuário
class UserCreate(BaseModel):
    email: EmailStr
    name: str
    password: str

# Schema para retornar dados de um usuário (sem a senha)
class UserPublic(BaseModel):
    id: int
    email: EmailStr
    name: str
    is_active: bool
    is_admin: bool


    class Config:
        from_attributes = True # Permite que o Pydantic leia dados de objetos SQLAlchemy