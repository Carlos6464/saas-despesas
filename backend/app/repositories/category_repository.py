# app/repositories/category_repository.py
from sqlalchemy.orm import Session, joinedload
from sqlalchemy import or_
from typing import List, Optional, Dict, Any
from app.models.category_model import Category
from app.schemas.category_schema import CategoryCreate, CategoryUpdate

class CategoryRepository:
    def __init__(self, db: Session):
        self.db = db

    def create(self, category: CategoryCreate, user_id: Optional[int] = None) -> Category:
        db_category = Category(name=category.name, user_id=user_id)
        self.db.add(db_category)
        self.db.commit()
        self.db.refresh(db_category)
        return db_category

    def get_by_id(self, category_id: int) -> Optional[Category]:
        return (
            self.db.query(Category)
            .options(joinedload(Category.owner))  
            .filter(Category.id == category_id)
            .first()
        )

    def get_all(self, skip: int = 0, limit: int = 100) -> List[Category]:
        return (
            self.db.query(Category)
            .options(joinedload(Category.owner))  
            .offset(skip)
            .limit(limit)
            .all()
        )

    def get_by_user_id(self, user_id: int, skip: int = 0, limit: int = 100) -> List[Category]:
        return (
            self.db.query(Category)
            .options(joinedload(Category.owner))  
            .filter(Category.user_id == user_id)
            .offset(skip)
            .limit(limit)
            .all()
        )
    
    def get_categories_for_user_and_public(
        self, user_id: int, name: Optional[str] = None, skip: int = 0, limit: int = 100
    ) -> Dict[str, Any]: # O tipo de retorno agora é um dicionário
        """
        Busca categorias com paginação e retorna os dados junto com o total.
        """
        # Constrói a query base com os filtros
        query = (
            self.db.query(Category)
            .options(joinedload(Category.owner))
            .filter(
                or_(
                    Category.user_id == user_id,
                    Category.user_id == None
                )
            )
        )

        if name:
            query = query.filter(Category.name.ilike(f"%{name}%"))

        # 1. Conta o número total de itens que correspondem à query (antes da paginação)
        total = query.count()

        # 2. Aplica a paginação e busca os dados da página atual
        data = query.offset(skip).limit(limit).all()

        # 3. Retorna um dicionário com os dados e o total
        return {"data": data, "total": total}

    def update(self, category_id: int, category_data: CategoryUpdate) -> Optional[Category]:
        db_category = self.get_by_id(category_id)
        if db_category:
            update_data = category_data.model_dump(exclude_unset=True)
            for key, value in update_data.items():
                setattr(db_category, key, value)
            self.db.commit()
            self.db.refresh(db_category)
        return db_category

    def delete(self, category_id: int) -> Optional[Category]:
        db_category = self.get_by_id(category_id)
        if db_category:
            self.db.delete(db_category)
            self.db.commit()
        return db_category