import json
import mimetypes
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from urllib.parse import urlparse

from inference import predict_crop

ROOT = __import__("pathlib").Path(__file__).resolve().parent.parent
UI_DIR = ROOT / "ui"


class CropRecommendationHandler(BaseHTTPRequestHandler):
    def _send_json(self, payload, status=200):
        body = json.dumps(payload).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json")
        self.send_header("Content-Length", str(len(body)))
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.end_headers()
        self.wfile.write(body)

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
        self.send_header("Access-Control-Allow-Origin", "*")
        self.end_headers()
        self.wfile.write(content)

    def do_OPTIONS(self):
        self.send_response(204)
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.end_headers()

    def do_GET(self):
        parsed = urlparse(self.path)
        if parsed.path in ("/", "/index.html"):
            self._serve_file(UI_DIR / "index.html")
            return

        if parsed.path == "/health":
            self._send_json({"status": "ok"})
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
        if parsed.path != "/predict":
            self.send_error(404, "Not found")
            return

        content_length = int(self.headers.get("Content-Length", "0"))
        raw_body = self.rfile.read(content_length) if content_length > 0 else b"{}"
        try:
            payload = json.loads(raw_body.decode("utf-8"))
            response = predict_crop(payload)
            self._send_json(response)
        except Exception as exc:  # pragma: no cover - runtime guard
            self._send_json({"error": str(exc)}, status=400)


if __name__ == "__main__":
    server = ThreadingHTTPServer(("0.0.0.0", 8000), CropRecommendationHandler)
    print("Serving crop recommendation demo on http://localhost:8000")
    server.serve_forever()
