# app/services/expense_service.py
from sqlalchemy.orm import Session
from fastapi import HTTPException, status

from app.repositories.expense_repository import ExpenseRepository
from app.repositories.category_repository import CategoryRepository
from app.schemas.expense_schema import ExpenseCreate, ExpenseUpdate
from app.models.user_model import User

class ExpenseService:
    def __init__(self, db: Session):
        """
        Inicializa o serviço com a sessão do banco de dados e os repositórios.
        """
        self.db = db
        self.expense_repo = ExpenseRepository(db)
        self.category_repo = CategoryRepository(db)

    def create_expense_for_user(self, expense_data: ExpenseCreate, current_user: User):
        """
        Cria uma nova despesa, verificando se a categoria pertence ao utilizador.
        """
        # Regra de negócio: A categoria deve existir e pertencer ao utilizador logado.
        category = self.category_repo.get_by_id(expense_data.category_id)

        # Validação:
        # 1. A categoria deve existir.
        if not category:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="A categoria especificada não foi encontrada."
            )

        # 2. A categoria deve ser global (user_id is None) OU pertencer ao utilizador.
        is_global_category = category.user_id is None
        is_owner = category.user_id == current_user.id

        if not (is_global_category or is_owner):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Acesso negado. A categoria selecionada não é global nem pertence a este utilizador."
            )
        
        return self.expense_repo.create(expense=expense_data, user_id=current_user.id)

    def get_expense_by_id(self, expense_id: int, current_user: User):
        """
        Busca uma despesa pelo ID, garantindo que ela pertença ao utilizador logado.
        """
        expense = self.expense_repo.get_by_id(expense_id)
        if not expense:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Despesa não encontrada."
            )
        if expense.user_id != current_user.id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Você não tem permissão para acessar este recurso."
            )
        return expense

    def get_all_expenses_for_user(self, current_user: User, skip: int = 0, limit: int = 100):
        """
        Retorna todas as despesas pertencentes ao utilizador logado.
        """
        return self.expense_repo.get_by_user_id(user_id=current_user.id, skip=skip, limit=limit)

    def update_expense(self, expense_id: int, expense_data: ExpenseUpdate, current_user: User):
        """
        Atualiza uma despesa, garantindo que ela pertença ao utilizador logado.
        """
        expense_to_update = self.get_expense_by_id(expense_id, current_user) # Reutiliza a lógica de verificação
        return self.expense_repo.update(expense_id=expense_to_update.id, expense_data=expense_data)

    def delete_expense(self, expense_id: int, current_user: User):
        """
        Deleta uma despesa, garantindo que ela pertença ao utilizador logado.
        """
        expense_to_delete = self.get_expense_by_id(expense_id, current_user) # Reutiliza a lógica de verificação
        return self.expense_repo.delete(expense_id=expense_to_delete.id)