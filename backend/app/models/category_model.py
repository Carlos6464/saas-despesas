
from os import name


from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.db.base import Base

class Category(Base):
    __tablename__ = "categories"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), unique=True, nullable=False)

    # Colunas de data com valores automáticos
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Chave estrangeira opcional para o usuário
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)

    # Relacionamento para acessar o objeto User a partir de uma Category
    owner = relationship("User")
    expenses = relationship("Expense", back_populates="category")

