# app/schemas/token_schema.py
from pydantic import BaseModel
from .user_schema import UserPublic

class Token(BaseModel):
    access_token: str
    token_type: str
    user: UserPublic

class TokenData(BaseModel):
    email: str | None = None