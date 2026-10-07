import base64
import hashlib
import hmac
import os
import re
import secrets
import sqlite3
import time
from contextlib import contextmanager
from pathlib import Path

PASSWORD_ITERATIONS = 240_000
SESSION_LIFETIME_SECONDS = 7 * 24 * 60 * 60
EMAIL_PATTERN = re.compile(r"^[^@\s]+@[^@\s]+\.[^@\s]+$")
DUMMY_SALT = secrets.token_bytes(16)
DUMMY_HASH = hashlib.pbkdf2_hmac(
    "sha256", b"not-a-user-password", DUMMY_SALT, PASSWORD_ITERATIONS
)


class AuthenticationError(ValueError):
    pass


class AuthStore:
    def __init__(self, database_path: Path):
        self.database_path = Path(database_path)
        self.database_path.parent.mkdir(parents=True, exist_ok=True)
        with self._connect() as connection:
            connection.executescript(
                """
                CREATE TABLE IF NOT EXISTS users (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    email TEXT NOT NULL UNIQUE,
                    display_name TEXT NOT NULL,
                    password_salt BLOB,
                    password_hash BLOB,
                    created_at INTEGER NOT NULL,
                    CHECK (
                        (password_salt IS NULL AND password_hash IS NULL)
                        OR
                        (password_salt IS NOT NULL AND password_hash IS NOT NULL)
                    )
                );
                CREATE TABLE IF NOT EXISTS sessions (
                    token_hash TEXT PRIMARY KEY,
                    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
                    expires_at INTEGER NOT NULL
                );
                CREATE INDEX IF NOT EXISTS sessions_expiry_idx ON sessions(expires_at);
                """
            )

    @contextmanager
    def _connect(self):
        connection = sqlite3.connect(self.database_path, timeout=10)
        connection.row_factory = sqlite3.Row
        connection.execute("PRAGMA foreign_keys = ON")
        try:
            with connection:
                yield connection
        finally:
            connection.close()

    @staticmethod
    def _normalize_email(email):
        if not isinstance(email, str):
            raise AuthenticationError("Enter a valid email address.")
        normalized = email.strip().lower()
        if len(normalized) > 254 or not EMAIL_PATTERN.fullmatch(normalized):
            raise AuthenticationError("Enter a valid email address.")
        return normalized

    @staticmethod
    def _validate_password(password):
        if not isinstance(password, str) or len(password) < 8:
            raise AuthenticationError("Password must be at least 8 characters.")
        if len(password.encode("utf-8")) > 1024:
            raise AuthenticationError("Password is too long.")

    @staticmethod
    def _password_hash(password, salt):
        return hashlib.pbkdf2_hmac(
            "sha256", password.encode("utf-8"), salt, PASSWORD_ITERATIONS
        )

    @staticmethod
    def _user_payload(row):
        return {
            "id": row["id"],
            "email": row["email"],
            "name": row["display_name"],
        }

    @staticmethod
    def _token_hash(token):
        return hashlib.sha256(token.encode("ascii")).hexdigest()

    def _create_session(self, connection, user_id):
        token = base64.urlsafe_b64encode(secrets.token_bytes(32)).decode("ascii").rstrip("=")
        now = int(time.time())
        connection.execute("DELETE FROM sessions WHERE expires_at <= ?", (now,))
        connection.execute(
            "INSERT INTO sessions (token_hash, user_id, expires_at) VALUES (?, ?, ?)",
            (self._token_hash(token), user_id, now + SESSION_LIFETIME_SECONDS),
        )
        return token

    def register(self, email, password, display_name):
        normalized_email = self._normalize_email(email)
        self._validate_password(password)
        if not isinstance(display_name, str):
            raise AuthenticationError("Enter your name.")
        name = " ".join(display_name.split())
        if not name or len(name) > 80:
            raise AuthenticationError("Enter a name between 1 and 80 characters.")

        salt = secrets.token_bytes(16)
        password_hash = self._password_hash(password, salt)
        try:
            with self._connect() as connection:
                cursor = connection.execute(
                    """
                    INSERT INTO users (
                        email, display_name, password_salt, password_hash, created_at
                    ) VALUES (?, ?, ?, ?, ?)
                    """,
                    (normalized_email, name, salt, password_hash, int(time.time())),
                )
                row = connection.execute(
                    "SELECT * FROM users WHERE id = ?", (cursor.lastrowid,)
                ).fetchone()
                token = self._create_session(connection, row["id"])
        except sqlite3.IntegrityError as exc:
            raise AuthenticationError("An account with that email already exists.") from exc
        return self._user_payload(row), token

    def login(self, email, password):
        normalized_email = self._normalize_email(email)
        if not isinstance(password, str) or len(password.encode("utf-8")) > 1024:
            raise AuthenticationError("Email or password is incorrect.")

        with self._connect() as connection:
            row = connection.execute(
                "SELECT * FROM users WHERE email = ?", (normalized_email,)
            ).fetchone()
            salt = row["password_salt"] if row and row["password_salt"] else DUMMY_SALT
            expected = row["password_hash"] if row and row["password_hash"] else DUMMY_HASH
            actual = self._password_hash(password, salt)
            if not row or not row["password_hash"] or not hmac.compare_digest(actual, expected):
                raise AuthenticationError("Email or password is incorrect.")
            token = self._create_session(connection, row["id"])
        return self._user_payload(row), token

    def get_user(self, token):
        if not isinstance(token, str) or not re.fullmatch(r"[A-Za-z0-9_-]{43}", token):
            return None
        with self._connect() as connection:
            row = connection.execute(
                """
                SELECT users.* FROM sessions
                JOIN users ON users.id = sessions.user_id
                WHERE sessions.token_hash = ? AND sessions.expires_at > ?
                """,
                (self._token_hash(token), int(time.time())),
            ).fetchone()
        return self._user_payload(row) if row else None

    def logout(self, token):
        if not isinstance(token, str) or not re.fullmatch(r"[A-Za-z0-9_-]{43}", token):
            return
        with self._connect() as connection:
            connection.execute(
                "DELETE FROM sessions WHERE token_hash = ?", (self._token_hash(token),)
            )
DATABASE_PATH = Path(
    os.environ.get("FIELDWISE_AUTH_DB", Path(__file__).resolve().parent.parent / "data" / "fieldwise_auth.sqlite3")
)
AUTH_STORE = AuthStore(DATABASE_PATH)
