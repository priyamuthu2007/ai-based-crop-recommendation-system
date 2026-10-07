import tempfile
import unittest
from pathlib import Path

from src.auth import AuthStore, AuthenticationError


class TestAuthStore(unittest.TestCase):
    def setUp(self):
        self.temp_dir = tempfile.TemporaryDirectory()
        self.store = AuthStore(Path(self.temp_dir.name) / "accounts.sqlite3")

    def tearDown(self):
        self.temp_dir.cleanup()

    def test_register_login_and_logout(self):
        user, session = self.store.register(
            "Farmer@example.com", "correct horse 1", "  Lakshmi   Devi  "
        )

        self.assertEqual(user["email"], "farmer@example.com")
        self.assertEqual(user["name"], "Lakshmi Devi")
        self.assertEqual(self.store.get_user(session), user)
        self.assertEqual(self.store.login("FARMER@example.com", "correct horse 1")[0], user)

        self.store.logout(session)
        self.assertIsNone(self.store.get_user(session))

    def test_rejects_duplicate_registration_and_wrong_password(self):
        self.store.register("farmer@example.com", "correct horse 1", "Lakshmi")

        with self.assertRaisesRegex(AuthenticationError, "already exists"):
            self.store.register("FARMER@example.com", "another password", "Farmer")
        with self.assertRaisesRegex(AuthenticationError, "incorrect"):
            self.store.login("farmer@example.com", "wrong password")

    def test_rejects_invalid_registration_values(self):
        with self.assertRaisesRegex(AuthenticationError, "valid email"):
            self.store.register("not-an-email", "correct horse 1", "Farmer")
        with self.assertRaisesRegex(AuthenticationError, "at least 8"):
            self.store.register("farmer@example.com", "short", "Farmer")
if __name__ == "__main__":
    unittest.main()
