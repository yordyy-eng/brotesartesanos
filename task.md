# 📋 Scrum Board: Catálogo Digital Brotes de Chile 2026

## 🎯 Sprint Goal (actualizado)
Catálogo administrable por el cliente sin depender de un dev para cada cambio: CMS propio (Payload), multiidioma ES/EN, y las secciones institucionales que el cliente pidió replicar de huellasdenahuelbuta.cl.

## 🟢 Done (Completado)

### Base del catálogo (Sprint 1)
- [x] Next.js 16 (App Router) + TypeScript + Tailwind + Framer Motion + diseño Editorial Premium.
- [x] Extracción y auditoría de los 40 artesanos + 7 categorías reales desde el PDF fuente.
- [x] Fotos de los 40 artesanos (incluye recorte manual de los 2 que no tenían imagen embebida en el PDF).
- [x] Contactos reales (Instagram/teléfono/email) extraídos del texto impreso de cada página del PDF — ver nota de confiabilidad más abajo sobre los hipervínculos del PDF.
- [x] Páginas de perfil individual con SEO/OpenGraph dinámico.
- [x] Scrapeo de huellasdenahuelbuta.cl (historia, misión/visión, contacto institucional) — `scripts/huellas_scrape.json`.

### Migración a CMS + multiidioma (esta pasada)
- [x] **Payload CMS 3** instalado dentro del mismo Next.js (`/admin`), self-hosted, Postgres compartido con tablas en un schema propio (`payload`, aislado de lo que era `public`).
- [x] Colecciones: `Artisans`, `Categories`, `Media`, `Users` (admin). Globals de contenido: `HomeHero`, `AgrupacionHome`, `Historia`, `SobreNosotros`, `Contacto` — todos con campos localizados ES/EN (`fallback: true`).
- [x] Migrados los 40 artesanos + 7 categorías + 40 fotos desde la base vieja al CMS.
- [x] **Prisma retirado por completo**: tablas viejas borradas, dependencias desinstaladas, `prisma/` eliminado. Payload es ahora la única fuente de datos.
- [x] **next-intl**: rutas `/es/...` y `/en/...`, selector de idioma en el header, todos los textos de interfaz traducidos vía `messages/es.json` / `messages/en.json`.
- [x] **Reestructuración del sitio**: la portada (`/`) ahora es sobre la **Agrupación Huellas de Nahuelbuta** (hero propio + 4 tarjetas de navegación), y "Brotes de Chile" (hero + grid de 40 artesanos) pasó a ser una sub-página propia en `/brotes-de-chile`. Nav: Historia · Sobre Nosotros · Brotes de Chile · Contacto.
- [x] **Páginas nuevas**: `/historia`, `/sobre-nosotros`, `/contacto` — contenido real de huellasdenahuelbuta.cl, editable desde `/admin`.
- [x] `SiteHeader` (nav + selector de idioma) y `Footer` (datos de contacto desde el CMS).
- [x] **Traducción completa al inglés**: los 40 artesanos (nombre/oficio/bio), las 7 categorías, y los 5 globals de contenido ya tienen su versión `en` real cargada — `/en` ya no depende del fallback a español.
- [x] Fix de un bug real: los campos tipo array con sub-campos localizados (`stats`, `cards`, `timeline`, `valores`) perdían su versión en un idioma al escribir el otro, porque Payload reemplaza las filas del array si no se reutiliza el mismo `id` por fila. Documentado en `scripts/translate-en.ts` (función `withIds`) para cualquier script futuro que traduzca contenido por lote.
- [x] Fondo de textura (`noise.svg`) migrado de un servicio externo caído a un archivo local (`public/noise.svg`).
- [x] Build de producción verificado en cada checkpoint; CRUD del admin probado (login, crear/editar/borrar, subida de imagen, hook de slug automático).

## 🔵 To Do

- [ ] **Cargar la contraseña del admin en un gestor de contraseñas** — se generó una al azar durante esta sesión y se mostró una sola vez en el chat; no quedó guardada en ningún archivo del repo. Cambiarla desde `/admin` en el primer login. Usuario actual: `yordy.salinas@adelchen.cl`.
- [ ] Revisar la traducción al inglés (la hice yo mismo, no un traductor profesional ni un servicio de traducción) — especialmente los nombres de oficios y las bios genéricas de los artesanos.
- [ ] Conseguir contacto para 2 artesanos sin Instagram/teléfono impreso en su página: Víctor Gutiérrez y Pedro Navarrete (corregible desde `/admin`, sin tocar código).
- [ ] Confirmar el texto de "Visión"/"Vision" en Sobre Nosotros contra `https://huellasdenahuelbuta.cl/146-2/` — el HTML original tenía un artefacto de acordeón que hizo ambigua la separación entre Misión/Visión; se combinó el texto de forma razonable pero vale la pena una revisión humana.
- [ ] Decidir si las bios cortas y genéricas de los artesanos se reemplazan por las bios reales y extensas del catálogo PDF — ahora es una tarea de contenido pura (editar desde `/admin`), no de código.
- [ ] Revisar si el diseño visual de las páginas nuevas debería acercarse más al look real de huellasdenahuelbuta.cl (hoy usa el sistema de diseño Editorial Premium del catálogo, no una réplica visual del sitio viejo).

## 🟣 Backlog (Portfolio Senior & DevOps / Producto)

- [ ] Tienda online (`@payloadcms/plugin-ecommerce`, Beta) — colecciones de Productos/Carritos/Órdenes ya existen como plugin oficial de Payload cuando se necesite.
- [ ] Bot de orientación para el catálogo (alimentado por el contenido ya estructurado en Payload).
- [ ] Configurar GitHub Actions (CI/CD).
- [x] Implementar Dockerfile para la aplicación Next.js — `Dockerfile` + `docker-compose.prod.yml`, desplegado en el VPS de la agencia (`huellas.adelchen.cl`, ver `docs/DEPLOY.md`).
- [ ] Tests end-to-end (e2e) — todavía no existen. Playwright ya se usó ad-hoc para screenshots de verificación durante el desarrollo, pero no hay una suite real de tests.
- [ ] SEO audit (Lighthouse > 90) — el plugin de SEO de Payload ya está activo en `Artisans` y los 4 globals.
- [x] Despliegue final a producción — desplegado en `huellas.adelchen.cl` (VPS Oracle Cloud de adelchen.cl, Docker Compose propio). Ver `docs/DEPLOY.md`.

---

## ⚠️ Nota importante: los enlaces del PDF NO son confiables como fuente de contacto

La tabla "Links extraídos (44 total)" (ver más abajo) viene de las anotaciones de hipervínculo embebidas en el PDF. Al cruzarla con el texto impreso real de cada página, se confirmó que **no corresponde al Instagram de cada artesano** — es un botón/plantilla reutilizada en el diseño que quedó apuntando al mismo enlace en varias páginas (ej. `elmundodemussa` aparece en 9 páginas de artesanos distintos). El contacto real de cada persona es el que aparece impreso como texto en su propia página del PDF, y así quedó cargado en Payload.

## 🏛️ Contexto institucional (de huellasdenahuelbuta.cl y del PDF)

- **Organización:** Agrupación ASAC Huellas de Nahuelbuta — nace en el otoño de 2021 (post-pandemia), se formaliza en enero de 2022 con 15 artesanos/productores fundadores. Colabora con la Municipalidad de Angol.
- **Hitos:** feria inaugural feb-2022 · primera Expo Destino (~80 participantes) dic-2022 · proyecto FNDR 2024 (carpas 6x12m) · proyecto FONDES + Jardín Identitario 2025 · Fondart Nacional 2026 para la **40ª Muestra de Arte Popular Chileno "Brotes de Chile"** (el festival en sí existe desde 1984). Todo esto ya vive en el global `Historia` de Payload.
- **Roles clave del catálogo 2026:** Mariana Rojas Román (@sietecolorescreaciones, también artesana) = Productora General. María Elisa Robles Rivas (@rustica_telares_nahuelbuta, también artesana "María Robles") = Productora Ejecutiva.
- **Contacto agrupación:** agrupacion.huellasdenahuelbuta@gmail.com · IG/FB @agrupacion_huellasdenahuelbuta — ya vive en el global `Contacto` de Payload.
- El sitio web tiene además una sección `/artesanos/` con **otros** productores locales (papelería, sal gourmet, apicultura, viveros, gastronomía, macramé, etc.) que **no** son parte de los 40 del catálogo PDF "Brotes de Chile 2026" — son parte de la agrupación más amplia. No se incorporaron; evaluar si tiene sentido como sección aparte más adelante.

---

## 📦 Assets Extraídos del PDF

**Fuente:** `CATÁLOGO ARTESANOS 2026.pdf` (171MB, 52 páginas)
**Destino:** `public/pdf-assets/`

### Estructura del PDF
| Páginas | Contenido |
|---------|-----------|
| 1–8 | Portada, índice, galería de recuerdos, historia de Huellas de Nahuelbuta |
| 9–49 | Catálogo artesanos (doble página por artesano) |
| 50 | Agradecimientos + logos de patrocinadores |
| 51–52 | Créditos / cierre |

### Archivos generados
| Carpeta | Contenido | Cantidad |
|---------|-----------|----------|
| `public/pdf-assets/pages/` | Páginas completas renderizadas a JPG (2x, ~150dpi) | 52 |
| `public/pdf-assets/images/` | Imágenes embebidas extraídas (`pXX_imgYY.jpg/png`) | 385 |
| `public/pdf-assets/index.json` | Índice completo: links e imágenes por página | 1 |

### Links extraídos (44 total) — ⚠️ ver nota de confiabilidad arriba, no usar para poblar contactos
| Instagram URL | Página PDF |
|---------------|-----------|
| instagram.com/grabadoslinares | p10, p24, p25, p39, p42 |
| instagram.com/elmundodemussa | p11, p14, p20, p28, p30, p34, p35, p37, p38 |
| instagram.com/caladosvergara | p12 |
| instagram.com/chupallas_de_trigo | p12, p17 |
| instagram.com/queltehue__ | p15 |
| instagram.com/topacio.taller | p16 |
| instagram.com/joyasnaynay | p18, p46 |
| instagram.com/n3olitico | p19, p26 |
| instagram.com/grabadosenvidrio | p21 |
| instagram.com/jorge_artesanoencuero | p22 |
| instagram.com/rastadecobre | p23, p36, p47 |
| instagram.com/kulungu.crafts | p27 |
| instagram.com/rusti2628 | p29 |
| instagram.com/asunarte__ | p31 |
| instagram.com/artetextil.angol | p32, p33 |
| instagram.com/ondejulio_gredasquillon | p40 |
| instagram.com/newen.fuerzayenergia | p41 |
| instagram.com/turriart | p43 |
| instagram.com/licanrayenab | p44, p48 |
| instagram.com/pamelagacitua_artemadera | p45, p49 |
| sellofronterasur.com/melimapu | p50 |
| instagram.com/sietecolorescreaciones | p50 |
| instagram.com/rustica_telares_nahuelbuta | p50 |
| instagram.com/claudiovisual_ | p51 |
