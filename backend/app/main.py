# app/main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.db.base import Base
from app.db.database import engine
from app.api.v1 import user_router, auth_router, category_router, admin_router, expense_router

# ... resto do seu código ...

app = FastAPI(
    title="Expense Tracker API",
    description="API para gerenciamento de despesas.",
    version="1.0.0"
)

# Altere esta linha para ser mais específica
# Em vez de ["*"], liste os domínios permitidos
origins = [
    "http://localhost:4200",
]

# Adicione o Middleware de CORS ao seu aplicativo
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins, # Use a lista de origens que acabamos de criar
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ... resto dos seus 'app.include_router' ...
app.include_router(admin_router.router, prefix="/api/v1")
app.include_router(auth_router.router, prefix="/api/v1")
app.include_router(user_router.router, prefix="/api/v1")
app.include_router(category_router.router, prefix="/api/v1")
app.include_router(expense_router.router, prefix="/api/v1")