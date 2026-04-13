"""Unit tests for security utilities — hash, verify, JWT."""

import pytest
from jose import JWTError

from src.utils.security import (
    create_access_token,
    decode_token,
    hash_password,
    verify_password,
)


def test_hash_password_returns_non_empty_string() -> None:
    hashed = hash_password("mysecretpassword")
    assert hashed
    assert hashed != "mysecretpassword"


def test_verify_password_returns_true_for_correct_password() -> None:
    hashed = hash_password("correct-password")
    assert verify_password("correct-password", hashed) is True


def test_verify_password_returns_false_for_wrong_password() -> None:
    hashed = hash_password("correct-password")
    assert verify_password("wrong-password", hashed) is False


def test_create_access_token_returns_decodable_jwt() -> None:
    token = create_access_token(subject="user-123")
    payload = decode_token(token)
    assert payload["sub"] == "user-123"
    assert payload["type"] == "access"


def test_decode_token_raises_on_invalid_token() -> None:
    with pytest.raises(JWTError):
        decode_token("not.a.valid.token")
