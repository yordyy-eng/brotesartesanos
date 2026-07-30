"""
Descarga todos los recursos gráficos (imágenes) del sitio oficial
huellasdenahuelbuta.cl, para tenerlos disponibles como referencia/insumo
al rediseñar brotesartesanos. Recorre las mismas 5 páginas que ya se
scrapearon por texto en scrape_huellas.py.

Uso:
    python scripts/download_huellas_assets.py
"""

import os
import re
from pathlib import Path
from urllib.parse import urljoin, urlparse

import requests
from bs4 import BeautifulSoup

BASE_URL = "https://huellasdenahuelbuta.cl"

PAGES = [
    "/",
    "/135-2/",
    "/146-2/",
    "/artesanos/",
    "/muestra-de-arte-popular-chileno/",
]

HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
        "(KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36"
    ),
    "Accept-Language": "es-CL,es;q=0.9",
}

OUTPUT_DIR = Path(__file__).parent.parent / "public" / "reference" / "huellas-oficial"

IMAGE_EXT_RE = re.compile(r"\.(jpe?g|png|gif|webp|svg|avif)(\?.*)?$", re.IGNORECASE)


def extract_image_urls(html: str, page_url: str) -> set[str]:
    soup = BeautifulSoup(html, "html.parser")
    urls: set[str] = set()

    for img in soup.find_all("img"):
        for attr in ("src", "data-src", "data-lazy-src"):
            val = img.get(attr)
            if val:
                urls.add(urljoin(page_url, val))
        srcset = img.get("srcset") or img.get("data-srcset")
        if srcset:
            for part in srcset.split(","):
                candidate = part.strip().split(" ")[0]
                if candidate:
                    urls.add(urljoin(page_url, candidate))

    for tag in soup.find_all(style=True):
        for match in re.finditer(r"url\(([^)]+)\)", tag["style"]):
            raw = match.group(1).strip("'\" ")
            if raw:
                urls.add(urljoin(page_url, raw))

    for link in soup.find_all("link", rel=lambda v: v and "icon" in v):
        href = link.get("href")
        if href:
            urls.add(urljoin(page_url, href))

    return {u for u in urls if IMAGE_EXT_RE.search(urlparse(u).path)}


def safe_filename(url: str) -> str:
    path = urlparse(url).path
    name = os.path.basename(path) or "image"
    return name


def main() -> None:
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    all_urls: set[str] = set()

    for path in PAGES:
        url = urljoin(BASE_URL, path)
        print(f"Extrayendo imágenes de {path} ...")
        try:
            resp = requests.get(url, headers=HEADERS, timeout=20)
            resp.raise_for_status()
        except requests.RequestException as exc:
            print(f"  ! Error en {path}: {exc}")
            continue
        found = extract_image_urls(resp.text, url)
        print(f"  {len(found)} imágenes encontradas")
        all_urls.update(found)

    print(f"\nTotal de imágenes únicas: {len(all_urls)}")
    print("Descargando...")

    downloaded = 0
    skipped = 0
    seen_names: dict[str, int] = {}

    for img_url in sorted(all_urls):
        name = safe_filename(img_url)
        # Evitar colisiones de nombre entre imágenes distintas con el mismo basename
        if name in seen_names:
            seen_names[name] += 1
            stem, ext = os.path.splitext(name)
            name = f"{stem}-{seen_names[name]}{ext}"
        else:
            seen_names[name] = 0

        dest = OUTPUT_DIR / name
        try:
            resp = requests.get(img_url, headers=HEADERS, timeout=20)
            resp.raise_for_status()
            dest.write_bytes(resp.content)
            downloaded += 1
        except requests.RequestException as exc:
            print(f"  ! No se pudo descargar {img_url}: {exc}")
            skipped += 1

    print(f"\n--- Listo: {downloaded} descargadas, {skipped} con error ---")
    print(f"Guardadas en: {OUTPUT_DIR}")


if __name__ == "__main__":
    main()
