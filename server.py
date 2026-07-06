#!/usr/bin/env python3
"""Förklara AI — den lokala motorn.

Serverar verktyget på http://127.0.0.1:8765 och ger redigeringsläget två
superkrafter som en dubbelklickad HTML-fil inte kan ha:

  POST /api/spara/<föreläsning>  skriver manifest.js på RÄTT plats, alltid
  POST /api/publicera            git add + commit + push → webblänken uppdateras

Motorn lyssnar bara på den egna datorn (127.0.0.1) — inget släpps ut på nätet.
Kör man skriptet när motorn redan är igång öppnas bara webbläsaren igen.
"""
import http.server
import json
import os
import re
import socketserver
import subprocess
import threading
import webbrowser

ROT = os.path.dirname(os.path.abspath(__file__))
PORT = 8765
ADRESS = f"http://127.0.0.1:{PORT}/"


def git(*args):
    return subprocess.run(["git", *args], cwd=ROT, capture_output=True, text=True)


class Hanterare(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *a, **kw):
        super().__init__(*a, directory=ROT, **kw)

    def log_message(self, *a):  # håll terminalen lugn
        pass

    def end_headers(self):
        self.send_header("Cache-Control", "no-store")  # alltid färskt innehåll
        super().end_headers()

    def svara(self, data, kod=200):
        b = json.dumps(data, ensure_ascii=False).encode("utf-8")
        self.send_response(kod)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(b)))
        super().end_headers()
        self.wfile.write(b)

    def do_GET(self):
        if self.path == "/api/status":
            ut = git("status", "--short")
            self.svara({"ok": True, "andringar": ut.stdout.strip()})
        else:
            super().do_GET()

    def do_POST(self):
        n = int(self.headers.get("Content-Length") or 0)
        kropp_bytes = self.rfile.read(n) if n else b""
        kropp = ""
        if not self.path.startswith("/api/bild/"):
            kropp = kropp_bytes.decode("utf-8")

        if self.path.startswith("/api/spara/"):
            forelasning = self.path.rsplit("/", 1)[-1]
            if not re.fullmatch(r"[A-Za-z0-9_-]+", forelasning):
                return self.svara({"ok": False, "fel": "Ogiltigt föreläsningsnamn."}, 400)
            mapp = os.path.join(ROT, "content", forelasning)
            if not os.path.isdir(mapp):
                return self.svara({"ok": False, "fel": "Okänd föreläsning: " + forelasning}, 404)
            if "window.LECTURE" not in kropp:
                return self.svara({"ok": False, "fel": "Det där såg inte ut som en innehållsfil — inget sparades."}, 400)
            with open(os.path.join(mapp, "manifest.js"), "w", encoding="utf-8") as f:
                f.write(kropp)
            return self.svara({"ok": True, "meddelande": "Sparat i projektet."})

        if self.path.startswith("/api/bild/"):
            forelasning = self.path.rsplit("/", 1)[-1]
            if not re.fullmatch(r"[A-Za-z0-9_-]+", forelasning):
                return self.svara({"ok": False, "fel": "Ogiltigt föreläsningsnamn."}, 400)
            mapp = os.path.join(ROT, "content", forelasning, "bilder")
            if not os.path.isdir(mapp):
                return self.svara({"ok": False, "fel": "Okänd föreläsning: " + forelasning}, 404)
            from urllib.parse import unquote
            namn = os.path.basename(unquote(self.headers.get("X-Filnamn") or "bild.png"))
            namn = re.sub(r'[/\\:*?"<>|]', "", namn).strip() or "bild.png"
            stam, andelse = os.path.splitext(namn)
            mal = os.path.join(mapp, namn)
            n = 2
            while os.path.exists(mal):  # skriv aldrig över en befintlig bild
                namn = f"{stam} {n}{andelse}"
                mal = os.path.join(mapp, namn)
                n += 1
            with open(mal, "wb") as f:
                f.write(kropp_bytes)
            return self.svara({"ok": True, "filnamn": namn})

        if self.path == "/api/publicera":
            git("add", "-A")
            if git("diff", "--cached", "--quiet").returncode == 0:
                git("pull", "--rebase")  # hämta ev. nyheter även när inget ska upp
                return self.svara({"ok": True, "meddelande": "Inget nytt att publicera — allt är redan uppe."})
            c = git("commit", "-m", "Uppdaterat innehåll via verktyget")
            if c.returncode != 0:
                return self.svara({"ok": False, "fel": "Kunde inte spara ändringen: " + c.stderr.strip()[-200:]})
            git("pull", "--rebase")  # väv ihop med ev. ändringar som gjorts någon annanstans
            p = git("push")
            if p.returncode != 0:
                return self.svara({"ok": False,
                                   "fel": "Kunde inte nå GitHub — är du online? (" + p.stderr.strip()[-160:] + ")"})
            return self.svara({"ok": True,
                               "meddelande": "Publicerat! Webblänken uppdateras inom några minuter."})

        self.svara({"ok": False, "fel": "Okänd adress."}, 404)


class Server(socketserver.TCPServer):
    allow_reuse_address = True


if __name__ == "__main__":
    try:
        server = Server(("127.0.0.1", PORT), Hanterare)
    except OSError:
        # Motorn kör redan — öppna bara verktyget.
        webbrowser.open(ADRESS)
        raise SystemExit(0)

    threading.Timer(0.4, lambda: webbrowser.open(ADRESS)).start()
    print("Förklara AI kör på " + ADRESS)
    print("Låt det här fönstret vara — stäng det (eller tryck Ctrl+C) när du är klar.")
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        pass
