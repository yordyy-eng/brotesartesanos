"""
Scraper de referencia para huellasdenahuelbuta.cl

Objetivo: dejar el contenido real del sitio actual del cliente (texto limpio +
metadata basica de SEO) en un JSON, para usarlo como fuente al migrar contenido
al nuevo sitio/CMS. No es un scraper generico: la lista de páginas es fija
porque ya se relevó la estructura de navegación del sitio a mano.

Uso:
    python scripts/scrape_huellas.py
"""

import json
import time
from pathlib import Path
from urllib.parse import urljoin

import requests
from bs4 import BeautifulSoup

BASE_URL = "https://huellasdenahuelbuta.cl"

PAGES = [
    "/",
    "/135-2/",                              # Nuestra Historia
    "/146-2/",                              # Sobre nosotros
    "/artesanos/",                          # Artesanas y Productores Artesanales
    "/muestra-de-arte-popular-chileno/",    # Catálogo digital / evento
]

HEADERS = {
    # El servidor tiene un WAF (ModSecurity) que devuelve 406 al
    # User-Agent por defecto de requests; con uno de navegador normal responde bien.
    "User-Agent": (
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
        "(KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36"
    ),
    "Accept-Language": "es-CL,es;q=0.9",
}

OUTPUT_PATH = Path(__file__).parent / "huellas_scrape.json"


def clean_text(soup: BeautifulSoup) -> str:
    for tag in soup(["script", "style", "noscript", "svg"]):
        tag.decompose()
    text = soup.get_text(separator="\n", strip=True)
    lines = [line for line in text.splitlines() if line.strip()]
    return "\n".join(lines)


def extract_links(soup: BeautifulSoup, base: str) -> list[str]:
    links = set()
    for a in soup.select("nav a[href], header a[href], footer a[href]"):
        href = a.get("href", "").strip()
        if not href or href.startswith(("#", "mailto:", "tel:", "javascript:")):
            continue
        full = urljoin(base, href)
        if full.startswith(BASE_URL):
            links.add(full)
    return sorted(links)


def scrape_page(path: str) -> dict:
    url = urljoin(BASE_URL, path)
    resp = requests.get(url, headers=HEADERS, timeout=20)
    resp.raise_for_status()
    soup = BeautifulSoup(resp.text, "html.parser")

    title = soup.title.string.strip() if soup.title and soup.title.string else None
    meta_desc_tag = soup.find("meta", attrs={"name": "description"})
    meta_desc = meta_desc_tag["content"].strip() if meta_desc_tag and meta_desc_tag.get("content") else None
    og_image_tag = soup.find("meta", attrs={"property": "og:image"})
    og_image = og_image_tag["content"] if og_image_tag and og_image_tag.get("content") else None

    main = soup.find("main") or soup.find(id="content") or soup.body
    text = clean_text(main) if main else clean_text(soup)

    return {
        "url": url,
        "title": title,
        "meta_description": meta_desc,
        "og_image": og_image,
        "nav_links_found": extract_links(soup, url),
        "text": text,
    }


def main() -> None:
    results = []
    for path in PAGES:
        print(f"Scrapeando {path} ...")
        try:
            results.append(scrape_page(path))
        except requests.RequestException as exc:
            print(f"  ! Error en {path}: {exc}")
            results.append({"url": urljoin(BASE_URL, path), "error": str(exc)})
        time.sleep(1)  # etiqueta: no golpear el servidor sin pausa

    OUTPUT_PATH.write_text(json.dumps(results, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"\nGuardado en {OUTPUT_PATH} ({len(results)} páginas)")


if __name__ == "__main__":
    main()
