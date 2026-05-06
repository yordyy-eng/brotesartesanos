# 📋 Scrum Board: Catálogo Digital Brotes de Chile 2026

## 🎯 Sprint 1 Goal
Tener el catálogo funcional, conectado a la base de datos (con los 40 artesanos cargados) y con el diseño premium aplicado para revisión inicial.

## 🟢 Done (Completado)
- [x] Inicializar proyecto Next.js (TypeScript, Tailwind, App Router)
- [x] Configurar Prisma y PostgreSQL (docker-compose)
- [x] Diseñar esquema de base de datos (Artesanos, Obras, Categorías)
- [x] Configurar variables de entorno
- [x] Extraer datos de los 40 artesanos del HTML original
- [x] Crear script de Seed para la base de datos
- [x] Configurar Sistema de Diseño (Colores tierra, Tipografía Serif en globals.css)
- [x] Implementar componente cliente del Catálogo (Filtros, Búsqueda, Grid)
- [x] Implementar API Routes para Artesanos y Categorías
- [x] Configurar ts-node para ejecutar scripts (migrado a `tsx`)
- [x] Ejecutar `prisma db push` y seed — 7 categorías + 40 artesanos en BD
- [x] Extraer assets del CATÁLOGO ARTESANOS 2026.pdf (385 imágenes + 52 páginas renderizadas + 44 links)

## 🟡 In Progress (En Progreso)
- [/] Revisión visual del frontend en el navegador (http://localhost:3000)
- [/] Asignar imágenes de artesanos a cada registro en la BD

## 🔵 To Do (Sprint Backlog - Próximos pasos)
- [ ] Páginas de detalle individual de Artesano (SEO optimizado)
- [ ] Animaciones de entrada con Framer Motion en el Grid
- [ ] Optimizar y asociar imágenes del PDF a artesanos en `public/artesanos/`
- [ ] Configurar validación de datos con Zod

## 🟣 Backlog (Portfolio Senior & DevOps)
- [ ] Configurar GitHub Actions (CI/CD)
- [ ] Implementar Dockerfile para la aplicación Next.js
- [ ] Agregar documentación de API (Swagger/Scalar)
- [ ] Implementar Logging (Pino/Winston)
- [ ] SEO audit (Lighthouse > 90)
- [ ] Despliegue final a producción (Deadline: 12 Mayo)

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

### Links extraídos (44 total)
Todos son Instagram de artesanos. Los correctos son:

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

### Próximo paso con imágenes
Las imágenes están nombradas por página (`p09_img01.jpg`, etc.). Para usarlas en el catálogo:
1. Abrir `public/pdf-assets/pages/page_09.jpg` → `page_49.jpg` para identificar manualmente qué artesano es cada doble página
2. Copiar la foto principal de cada artesano a `public/artesanos/<slug>.jpg`
3. Actualizar el seed o crear una migración para guardar el campo `image` en la BD
