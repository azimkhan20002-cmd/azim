#!/usr/bin/env python3
"""Serve the 'Smarter Than Yesterday' course locally.

Usage:
    python3 course_server.py [port]        # default port 8000

Then open http://localhost:8000/ in your browser.

Any static server works — this one is provided for zero-dependency
convenience (Python 3 standard library only). The course is plain
HTML/CSS/JS with no build step and no external network requests,
so it also works opened directly from disk or hosted on GitHub Pages.
"""

import http.server
import socketserver
import sys

PORT = int(sys.argv[1]) if len(sys.argv) > 1 else 8000


class Handler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        # Progress lives in localStorage; no caching surprises during study.
        self.send_header("Cache-Control", "no-store")
        super().end_headers()

    def log_message(self, fmt, *args):
        print(f"  {self.address_string()} — {fmt % args}")


if __name__ == "__main__":
    socketserver.TCPServer.allow_reuse_address = True
    with socketserver.TCPServer(("", PORT), Handler) as httpd:
        print(f"🧠 Smarter Than Yesterday — serving at http://localhost:{PORT}/")
        print("   Voice lessons: press play inside a lesson (British voices only).")
        print("   Stop with Ctrl+C.")
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nStopped. See you tomorrow — never miss twice.")
