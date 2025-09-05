# app/repositories/expense_repository.py
from sqlalchemy.orm import Session, joinedload
from typing import List, Optional

from app.models.expense_model import Expense
from app.schemas.expense_schema import ExpenseCreate, ExpenseUpdate

class ExpenseRepository:
    def __init__(self, db: Session):
        """
        Inicializa o repositório com a sessão do banco de dados.
        """
        self.db = db

    def create(self, expense: ExpenseCreate, user_id: int) -> Expense:
        """
        Cria uma nova despesa no banco de dados, associada a um utilizador.
        """
        db_expense = Expense(**expense.model_dump(), user_id=user_id)
        self.db.add(db_expense)
        self.db.commit()
        self.db.refresh(db_expense)
        return db_expense

    def get_by_id(self, expense_id: int) -> Optional[Expense]:
        """
        Busca uma única despesa pelo seu ID, fazendo JOIN com categoria e utilizador.
        Retorna None se não for encontrada.
        """
        return (
            self.db.query(Expense)
            .options(
                joinedload(Expense.category),
                joinedload(Expense.owner)
            )
            .filter(Expense.id == expense_id)
            .first()
        )

    def get_by_user_id(self, user_id: int, skip: int = 0, limit: int = 100) -> List[Expense]:
        """
        Busca todas as despesas de um utilizador, com paginação e JOINs.
        """
        return (
            self.db.query(Expense)
            .options(
                joinedload(Expense.category),
                joinedload(Expense.owner)
            )
            .filter(Expense.user_id == user_id)
            .offset(skip)
            .limit(limit)
            .all()
        )

    def update(self, expense_id: int, expense_data: ExpenseUpdate) -> Optional[Expense]:
        """
        Atualiza os dados de uma despesa existente.
        Retorna a despesa atualizada ou None se não for encontrada.
        """
        db_expense = self.get_by_id(expense_id)
        if db_expense:
            update_data = expense_data.model_dump(exclude_unset=True)
            for key, value in update_data.items():
                setattr(db_expense, key, value)
            
            self.db.commit()
            self.db.refresh(db_expense)
        return db_expense

    def delete(self, expense_id: int) -> Optional[Expense]:
        """
        Deleta uma despesa do banco de dados.
        Retorna a despesa deletada ou None se não for encontrada.
        """
        db_expense = self.get_by_id(expense_id)
        if db_expense:
            self.db.delete(db_expense)
            self.db.commit()
        return db_expense