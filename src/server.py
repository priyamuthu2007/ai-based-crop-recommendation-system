import json
import mimetypes
from http.cookies import CookieError, SimpleCookie
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from urllib.parse import urlparse

if __package__:
    from .auth import AUTH_STORE, AuthenticationError
    from .inference import predict_crop
else:
    from auth import AUTH_STORE, AuthenticationError
    from inference import predict_crop

ROOT = __import__("pathlib").Path(__file__).resolve().parent.parent
UI_DIR = ROOT / "ui"
MAX_REQUEST_BYTES = 64 * 1024


class CropRecommendationHandler(BaseHTTPRequestHandler):
    def _send_json(self, payload, status=200, session_token=None, clear_session=False):
        body = json.dumps(payload).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json")
        self.send_header("Content-Length", str(len(body)))
        self.send_header("Cache-Control", "no-store")
        if session_token is not None:
            self.send_header("Set-Cookie", self._session_cookie(session_token))
        elif clear_session:
            self.send_header(
                "Set-Cookie",
                "fieldwise_session=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0"
                + ("; Secure" if self._is_https() else ""),
            )
        self.end_headers()
        self.wfile.write(body)

    def _is_https(self):
        return self.headers.get("X-Forwarded-Proto", "").lower() == "https"

    def _session_cookie(self, token):
        cookie = (
            f"fieldwise_session={token}; Path=/; HttpOnly; SameSite=Lax; "
            f"Max-Age={7 * 24 * 60 * 60}"
        )
        return cookie + ("; Secure" if self._is_https() else "")

    def _session_user(self):
        cookies = SimpleCookie()
        try:
            cookies.load(self.headers.get("Cookie", ""))
        except CookieError:
            return None
        morsel = cookies.get("fieldwise_session")
        return AUTH_STORE.get_user(morsel.value) if morsel else None

    def _session_token(self):
        cookies = SimpleCookie()
        try:
            cookies.load(self.headers.get("Cookie", ""))
        except CookieError:
            return None
        morsel = cookies.get("fieldwise_session")
        return morsel.value if morsel else None

    def _require_same_origin(self):
        origin = self.headers.get("Origin")
        if not origin:
            return False
        parsed_origin = urlparse(origin)
        expected_scheme = "https" if self._is_https() else "http"
        return (
            parsed_origin.scheme == expected_scheme
            and parsed_origin.netloc.lower() == self.headers.get("Host", "").lower()
        )

    def _read_json(self):
        try:
            content_length = int(self.headers.get("Content-Length", "0"))
        except ValueError as exc:
            raise ValueError("Invalid request length.") from exc
        if content_length <= 0 or content_length > MAX_REQUEST_BYTES:
            raise ValueError("Request body is empty or too large.")
        if self.headers.get_content_type() != "application/json":
            raise ValueError("Expected application/json.")
        try:
            payload = json.loads(self.rfile.read(content_length).decode("utf-8"))
        except (UnicodeDecodeError, json.JSONDecodeError) as exc:
            raise ValueError("Invalid JSON request body.") from exc
        if not isinstance(payload, dict):
            raise ValueError("Request body must be a JSON object.")
        return payload

    def _serve_file(self, file_path, status=200):
        try:
            content = file_path.read_bytes()
        except FileNotFoundError:
            self.send_error(404, "File not found")
            return

        content_type, _ = mimetypes.guess_type(str(file_path))
        if content_type is None:
            content_type = "application/octet-stream"

        self.send_response(status)
        self.send_header("Content-Type", content_type)
        self.send_header("Content-Length", str(len(content)))
        self.end_headers()
        self.wfile.write(content)

    def do_OPTIONS(self):
        self.send_response(204)
        self.end_headers()

    def do_GET(self):
        parsed = urlparse(self.path)
        if parsed.path in ("/", "/index.html"):
            self._serve_file(UI_DIR / "index.html")
            return

        if parsed.path == "/health":
            self._send_json({"status": "ok"})
            return

        if parsed.path == "/auth/me":
            user = self._session_user()
            self._send_json({"authenticated": user is not None, "user": user})
            return

        request_path = parsed.path.lstrip("/")
        if not request_path:
            self._serve_file(UI_DIR / "index.html")
            return

        static_file = UI_DIR / request_path
        if static_file.exists() and static_file.is_file():
            self._serve_file(static_file)
            return

        self.send_error(404, "Not found")

    def do_POST(self):
        parsed = urlparse(self.path)
        if parsed.path not in (
            "/predict",
            "/auth/register",
            "/auth/login",
            "/auth/logout",
        ):
            self.send_error(404, "Not found")
            return

        if not self._require_same_origin():
            self._send_json({"error": "Request origin could not be verified."}, status=403)
            return

        try:
            payload = self._read_json()
        except ValueError as exc:
            self._send_json({"error": str(exc)}, status=400)
            return

        if parsed.path == "/auth/register":
            try:
                user, token = AUTH_STORE.register(
                    payload.get("email"), payload.get("password"), payload.get("name")
                )
            except AuthenticationError as exc:
                self._send_json({"error": str(exc)}, status=400)
                return
            self._send_json({"user": user}, status=201, session_token=token)
            return

        if parsed.path == "/auth/login":
            try:
                user, token = AUTH_STORE.login(payload.get("email"), payload.get("password"))
            except AuthenticationError as exc:
                self._send_json({"error": str(exc)}, status=401)
                return
            self._send_json({"user": user}, session_token=token)
            return

        if parsed.path == "/auth/logout":
            AUTH_STORE.logout(self._session_token())
            self._send_json({"logged_out": True}, clear_session=True)
            return

        if parsed.path == "/predict":
            if self._session_user() is None:
                self._send_json({"error": "Sign in to request a crop recommendation."}, status=401)
                return
            try:
                response = predict_crop(payload)
            except (ValueError, FileNotFoundError) as exc:
                self._send_json({"error": str(exc)}, status=400)
                return
            self._send_json(response)


if __name__ == "__main__":
    server = ThreadingHTTPServer(("127.0.0.1", 8000), CropRecommendationHandler)
    print("Serving crop recommendation demo on http://localhost:8000")
    server.serve_forever()
