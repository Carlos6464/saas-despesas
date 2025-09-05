# app/models/expense_model.py
from sqlalchemy import Column, Integer, String, DateTime, Date, Boolean, ForeignKey, Numeric
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.db.base import Base

class Expense(Base):
    __tablename__ = "expenses"

    # Colunas principais
    id = Column(Integer, primary_key=True, index=True)
    description = Column(String(255), nullable=False)
    due_date = Column(Date, nullable=False)
    is_paid = Column(Boolean, default=False, nullable=False)
    value = Column(Numeric(10, 2), nullable=False)
    
    # 1 para crédito (entrada), -1 para débito (saída)
    transaction_type = Column(Integer, nullable=False) 

    # Colunas de data com valores automáticos
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Chaves estrangeiras (relacionamentos)
    category_id = Column(Integer, ForeignKey("categories.id"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    # Relacionamentos para acessar os objetos a partir de uma Expense
    category = relationship("Category", back_populates="expenses")
    owner = relationship("User", back_populates="expenses")