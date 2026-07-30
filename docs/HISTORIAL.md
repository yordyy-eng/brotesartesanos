# Historial del proyecto

Registro narrativo de qué se hizo, en qué orden, y por qué — para que quien
retome el proyecto (humano o no) entienda el razonamiento detrás de las
decisiones, no solo el estado final del código. Para el estado pendiente
actual, ver la sección **To Do** de [`task.md`](../task.md). Para el "cómo
está armado hoy", ver [`ARQUITECTURA.md`](./ARQUITECTURA.md).

## 1. Punto de partida

El catálogo (`Sprint 1`, ver `task.md`) ya tenía los 40 artesanos + 7
categorías reales extraídos de `CATÁLOGO ARTESANOS 2026.pdf`, contactos
reales, perfiles individuales con SEO, y diseño "Editorial Premium" en
Next.js + Prisma + PostgreSQL. No había CMS: cualquier cambio de contenido
requería editar código y correr `prisma/seed.ts` a mano. No había
multiidioma, ni páginas institucionales (Historia, Sobre Nosotros, Contacto).

## 2. Elegir un CMS

El cliente pidió poder seguir editando y escalando el sitio sin depender de
un desarrollador para cada cambio de texto, en dos idiomas, pensando a futuro
en tienda online y un bot. Se evaluaron SaaS con capa gratis limitada
(Sanity, Contentful) contra un CMS propio. Se eligió **Payload CMS 3**:
self-hosted, MIT/gratis, se instala dentro del mismo Next.js (sin backend
separado), Local API para leer datos sin round-trip HTTP, localización
nativa por campo, y plugin de SEO oficial.

Alcance decidido explícitamente por el cliente: migrar **todo de una vez**
(los 40 artesanos incluidos, no en paralelo) y **retirar Prisma por
completo** una vez verificada la migración — no dejarlo como plan B.

## 3. Migración a Payload

- Payload requirió subir Next a `^16.2.6+` (gate de versión de
  `@payloadcms/next`).
- Las tablas de Payload se aislaron en su propio schema de Postgres
  (`schemaName: 'payload'`) para convivir sin fricción con las tablas viejas
  de Prisma (`public`) durante la transición — Drizzle (el motor de Payload)
  llegó a interpretar una tabla de Prisma como candidata a "rename" y quedó
  colgado esperando confirmación interactiva antes de este aislamiento.
- Colecciones (`Artisans`, `Categories`, `Media`, `Users`) y globals de
  contenido se definieron en `payload.config.ts` (detalle completo en
  `ARQUITECTURA.md`). Los `id` de artesanos/categorías se fijaron como texto
  igual a los slugs ya existentes (no autoincrement) para no romper URLs.
- Se escribió un script de migración one-shot que leyó la base vieja de
  Prisma y recreó cada artesano/categoría/imagen en Payload.
- Verificado el resultado completo (build, admin, CRUD, imágenes), se borró
  `prisma/`, se desinstalaron `prisma`/`@prisma/client`, y se removieron los
  scripts de `package.json`. `dotenv` (que antes venía como dependencia
  transitiva de Prisma) se instaló explícito porque el proyecto seguía
  necesitándolo.
- `middleware.ts` se renombró a `src/proxy.ts` (Next 16 deprecó el nombre
  viejo; además debe vivir en `src/` por la estructura del proyecto).

## 4. Multiidioma + copiar el landing oficial

Se integró **next-intl** (rutas `/es/...`, `/en/...`, selector de idioma en
el header). El cliente pidió explícitamente "copiar el landing" del sitio
real (`huellasdenahuelbuta.cl`) y mejorarlo desde ahí — se scrapeó ese sitio
(texto e imágenes, ver `docs/IMAGENES.md`) como fuente de contenido real para
Historia, Sobre Nosotros y Contacto, secciones que el catálogo no tenía.

## 5. Corrección de rumbo: la IA del sitio estaba mal

Primer intento de estas páginas nuevas recibió feedback directo y crítico:
la traducción al inglés no se veía reflejada, el diseño no se parecía al
sitio real, y — el punto más importante — **"Brotes de Chile" es solo el
catálogo de una muestra anual, no el sitio entero; el sitio entero es sobre
la agrupación** que organiza esa muestra entre otras cosas.

Esto forzó una reestructuración real de la información:
- `/` pasó a ser la portada de la **Agrupación Huellas de Nahuelbuta**
  (hero propio + navegación a las 4 secciones).
- El catálogo original (hero + grid de 40 artesanos) se movió completo a
  `/brotes-de-chile` como una sub-sección.
- Se completó la traducción real a inglés de los 40 artesanos, las 7
  categorías, y los 5 globals de contenido (antes dependían del fallback a
  español).

Al traducir, apareció un bug real de Payload: los campos `array` con
sub-campos localizados pierden el contenido del otro idioma si no se reusan
los mismos `id` de fila entre locales (Payload reemplaza las filas en vez de
mergear). Documentado con el detalle técnico y la solución (`withIds()`) en
`ARQUITECTURA.md`.

## 6. Rediseño visual

Pedido explícito: "menos genérico/IA, pero mantén los colores reales del
sitio oficial". Se tomó un screenshot del sitio oficial en vivo (no solo el
texto scrapeado) para extraer la paleta real y se migró `globals.css` de
marrón+dorado a **verde bosque + naranja terracota**, con overlays de hero en
gradientes radiales en capas en vez de un degradé plano. Se agregó el crédito
"Desarrollado por adelchen.cl" al footer, siguiendo el mismo patrón del sitio
oficial ("con amor por agencianexo.cl").

## 7. Fotografía real en vez de gradientes abstractos

Pedido: reemplazar los fondos de hero abstractos por fotografía real, usando
**todo** recurso gráfico disponible (no solo retratos de artesanos). Esto
implicó:

- Descargar programáticamente (`scripts/download_huellas_assets.py`, Python +
  requests + BeautifulSoup) las ~500 fotos del sitio oficial en sus 5 páginas
  conocidas.
- Mezclar tres fuentes de fotos (retratos de artesanos, imágenes del PDF,
  fotos del sitio oficial) en cada mosaico de hero — detalle completo del
  pipeline en `docs/IMAGENES.md`.
- Construir una **pantalla de carga en WebGL** (`LoadingScreen.tsx`, shaders
  crudos sin librerías) que revela el logo real de la agrupación con un
  efecto de umbral de ruido, una sola vez por sesión de navegador
  (`sessionStorage`), con fallback estático para `prefers-reduced-motion` o
  navegadores sin WebGL.

## 8. El mosaico se veía roto — diagnóstico y arreglo real

El usuario mandó un screenshot real del sitio en producción mostrando el
mosaico de fotos con huecos grandes y tiles dispersos, con feedback directo
pidiendo un arreglo real, no un parche. Causa raíz real (no solo estética):
`grid-auto-rows: 1fr` dentro de un contenedor `position: absolute; inset: 0`
con muy pocos tiles de foto estiraba esas pocas filas para llenar todo el
alto del hero, dejando tiles de `aspect-ratio: 1` de tamaño fijo flotando en
celdas gigantes. Arreglado con `grid-auto-rows: 110px` fijo (coherente con el
tamaño de columna) y subiendo la cantidad de fotos por hero de ~28 a 150.

Sobre esa misma base aparecieron dos bugs más, encontrados investigando por
qué quedaban 2-3 tiles en blanco: imágenes JPEG2000 mal etiquetadas como
`.jpg` (rompían tiles Y páginas de perfil de artesanos), y un crash real de
`npm run build` en Windows por usar `sharp` dentro de worker threads de Next.
Ambos con causa raíz identificada y arreglo permanente — detalle técnico
completo en `docs/IMAGENES.md`.

## 9. Más presencia gráfica del logo (esta sesión)

Además de la documentación completa (este set de archivos en `docs/`), se
pidió que el logo real de la agrupación tuviera más presencia:

- **Favicon**: el `favicon.ico` era el ícono genérico de placeholder de Next
  (un triángulo negro en un círculo) desde la creación del proyecto — nunca
  se había reemplazado. Se recortó el emblema circular del logo real (sin la
  banda de texto "HUELLAS de NAHUELBUTA", ilegible a tamaño de favicon), se
  centró sobre un lienzo cuadrado con margen, y se generaron:
  `src/app/favicon.ico` (multi-resolución 16/32/48/64), `src/app/icon.png`
  (512×512, fondo transparente, íconos modernos), y `src/app/apple-icon.png`
  (180×180, fondo color `--parchment` porque iOS no maneja bien transparencia
  en el ícono de acceso directo). Estos son convenciones de archivo de Next.js
  — no requieren configuración adicional en `metadata`.
- **Header**: `SiteHeader.tsx` ahora muestra el emblema (`logo-huellas-emblem.png`,
  48px, 36px en mobile) junto al wordmark de texto existente, en vez de solo
  texto.
- **Footer**: `Footer.tsx` ahora muestra el mismo emblema (96px) centrado
  arriba del nombre de la organización.

Se usó el emblema recortado (sin texto) para header/footer/favicon porque el
logo completo ya incluye "HUELLAS de NAHUELBUTA" como banda de texto — usarlo
junto al wordmark HTML existente hubiera duplicado el texto. El logo
completo (`logo-huellas.png`) se sigue usando tal cual en la pantalla de
carga WebGL, donde no hay texto adyacente y el espacio disponible es mayor.

## Decisiones que vale la pena recordar

- **Por qué `bio` es el único campo richText**: todo el resto del contenido
  migrado es texto plano; convertir todos los campos a richText hubiera
  significado construir un AST de Lexical para cada uno sin beneficio
  inmediato. `bio` es el único campo donde un editor humano razonablemente
  va a querer negritas/párrafos al escribir perfiles nuevos desde `/admin`.
- **Por qué no hay rutas propias `/api/artisans` o `/api/categories`**: si
  existieran como archivos estáticos, Next las resolvería antes que el
  catch-all de Payload, y el propio `/admin` (que depende de esas rutas
  nativas de Payload para sus listados y selectores de relación) se rompería
  en silencio para esas dos colecciones específicas.
- **Por qué los enlaces de Instagram extraídos del PDF no se usaron para
  poblar contactos**: los hipervínculos embebidos en el PDF resultaron ser un
  botón de plantilla reutilizado (el mismo enlace aparece en páginas de
  artesanos distintos) — el contacto real de cada persona es el que aparece
  impreso como texto en su propia página, y así quedó cargado.
