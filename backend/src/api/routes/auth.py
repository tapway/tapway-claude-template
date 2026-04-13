"""Authentication routes — login, logout, token refresh."""

from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, EmailStr

router = APIRouter()


# ─── Schemas ───────────────────────────────────────────────────────────────
class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    expires_in: int


class UserResponse(BaseModel):
    id: str
    email: str
    name: str
    role: str


# ─── Routes ────────────────────────────────────────────────────────────────
@router.post("/login", response_model=TokenResponse)
async def login(body: LoginRequest) -> TokenResponse:
    """
    Authenticate user and return JWT access token.

    Raises 401 if credentials are invalid.
    """
    # TODO: inject AuthService and call service.login(body.email, body.password)
    raise HTTPException(
        status_code=status.HTTP_501_NOT_IMPLEMENTED,
        detail="Auth service not yet implemented. See docs/plans/auth.md",
    )


@router.post("/logout", status_code=status.HTTP_204_NO_CONTENT)
async def logout() -> None:
    """Invalidate the current user's session."""
    # TODO: invalidate refresh token in DB
    pass


@router.get("/me", response_model=UserResponse)
async def get_current_user() -> UserResponse:
    """Return the currently authenticated user's profile."""
    # TODO: inject current_user from JWT dependency
    raise HTTPException(
        status_code=status.HTTP_501_NOT_IMPLEMENTED,
        detail="Not yet implemented",
    )
