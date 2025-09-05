# app/models/user_model.py
from os import name
from sqlalchemy import Column, Integer, String, Boolean
from sqlalchemy.orm import relationship
from app.db.base import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    email = Column(String(100), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    is_active = Column(Boolean, default=True)

    # Novo campo para identificar administradores
    # `nullable=False` garante que o campo sempre terá um valor (True ou False)
    is_admin = Column(Boolean, default=False, nullable=False)

    # Adicione este relacionamento reverso
    categories = relationship("Category", back_populates="owner")