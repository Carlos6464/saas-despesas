# app/api/v1/expense_router.py
from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from typing import List

from app.db.database import get_db
from app.core.security import get_current_user
from app.services.expense_service import ExpenseService
from app.schemas.expense_schema import ExpenseCreate, ExpenseUpdate, ExpensePublic
from app.models.user_model import User

router = APIRouter(prefix="/expenses", tags=["Expenses"])

@router.post("/", response_model=ExpensePublic, status_code=status.HTTP_201_CREATED)
def create_expense(
    expense: ExpenseCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Cria uma nova despesa para o utilizador autenticado.
    """
    service = ExpenseService(db)
    return service.create_expense_for_user(expense_data=expense, current_user=current_user)

@router.get("/", response_model=List[ExpensePublic])
def read_expenses(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Retorna uma lista de todas as despesas pertencentes ao utilizador autenticado.
    """
    service = ExpenseService(db)
    return service.get_all_expenses_for_user(current_user=current_user, skip=skip, limit=limit)

@router.get("/{expense_id}", response_model=ExpensePublic)
def read_expense(
    expense_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Retorna uma despesa específica pelo seu ID.
    Apenas o dono da despesa pode acedê-la.
    """
    service = ExpenseService(db)
    return service.get_expense_by_id(expense_id=expense_id, current_user=current_user)

@router.patch("/{expense_id}", response_model=ExpensePublic)
def update_expense(
    expense_id: int,
    expense: ExpenseUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Atualiza uma despesa existente.
    Apenas o dono da despesa pode atualizá-la.
    """
    service = ExpenseService(db)
    return service.update_expense(expense_id=expense_id, expense_data=expense, current_user=current_user)

@router.delete("/{expense_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_expense(
    expense_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Deleta uma despesa.
    Apenas o dono da despesa pode deletá-la.
    """
    service = ExpenseService(db)
    service.delete_expense(expense_id=expense_id, current_user=current_user)
    return None # Retorna uma resposta vazia com status 204