# app/main.py
from fastapi import FastAPI
from app.db.base import Base
from app.db.database import engine
from app.api.v1 import user_router, auth_router, category_router, admin_router



# Esta linha cria a tabela "users" no seu banco de dados se ela não existir
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Expense Tracker API",
    description="API para gerenciamento de despesas.",
    version="1.0.0"
)


# Inclui os roteadores da API (V1)
# Adiciona o novo roteador de admin
app.include_router(admin_router.router, prefix="/api/v1")

# Adiciona as rotas comuns
app.include_router(auth_router.router, prefix="/api/v1")
app.include_router(user_router.router, prefix="/api/v1")
app.include_router(category_router.router, prefix="/api/v1")

