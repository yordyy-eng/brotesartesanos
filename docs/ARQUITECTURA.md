# Arquitectura técnica

Referencia de cómo está construido el proyecto hoy. Para la historia de cómo
se llegó hasta acá (decisiones, migración desde Prisma, bugs encontrados),
ver [`HISTORIAL.md`](./HISTORIAL.md).

## Stack

| Capa | Tecnología |
|---|---|
| Framework | Next.js 16 (App Router, Turbopack) |
| Lenguaje | TypeScript |
| CMS | Payload CMS 3.86, self-hosted, montado dentro del mismo Next.js (`/admin`) |
| Base de datos | PostgreSQL, adaptador `@payloadcms/db-postgres` (Drizzle por debajo) |
| Multiidioma | next-intl — rutas `/es/...` y `/en/...` |
| Estilos | Tailwind CSS 4 + variables CSS nativas en `globals.css` |
| Animación | Framer Motion |
| Imágenes | `sharp` (vía Next Image), Pillow/Python solo en scripts de mantenimiento offline |

## Estructura de carpetas

```
payload.config.ts              # única fuente de verdad del CMS: colecciones, globals, plugins
next.config.ts                 # compone withPayload(withNextIntl(...))
src/
  proxy.ts                     # middleware de next-intl (Next 16 renombró middleware.ts -> proxy.ts)
  i18n/
    routing.ts                 # locales soportados (es, en), locale por defecto
    navigation.ts              # Link/useRouter/usePathname con conciencia de locale
    request.ts                 # config de next-intl para server components
  payload-types.ts             # tipos generados automáticamente por Payload (no editar a mano)
  lib/
    payload.ts                 # getPayloadClient() + getHeroPhotoMix()/getGalleryPhotos()
    pdf-images.ts               # candidatos de public/pdf-assets/images/ (lee manifest JSON)
    official-site-images.ts     # candidatos de public/reference/huellas-oficial/ (lee manifest JSON)
    richtext.ts                 # helper para renderizar el richText (Lexical) de `bio`
    generated/
      pdf-images-manifest.json           # generado por scripts/build-image-manifests.cjs
      official-site-images-manifest.json # ídem — NO editar a mano, ver docs/IMAGENES.md
  app/
    favicon.ico, icon.png, apple-icon.png  # íconos del sitio (convención de archivo de Next)
    globals.css                  # sistema de diseño: paleta, hero, grillas de fotos, footer, etc.
    (payload)/                    # generado por Payload — layout, /admin, API REST. No editar a mano.
    [locale]/
      layout.tsx                  # <html>/<body> real del sitio, fuentes, NextIntlClientProvider, Footer
      page.tsx                    # home = página de la Agrupación (hero + 4 tarjetas + galería)
      brotes-de-chile/
        page.tsx                  # fetch de artesanos/categorías/hero + pasa props a catalog-client
        catalog-client.tsx         # grilla filtrable de los 40 artesanos (client component)
      artesano/[id]/page.tsx      # perfil individual, SEO/OpenGraph dinámico
      historia/page.tsx            # institucional — global `historia`
      sobre-nosotros/page.tsx      # institucional — global `sobre-nosotros`
      contacto/page.tsx            # institucional — global `contacto`
      _components/
        SiteHeader.tsx             # nav + logo + selector ES/EN (client component)
        Footer.tsx                 # datos de contacto desde Payload + logo + crédito (server component)
        HeroPhotoGrid.tsx          # mosaico de fotos de fondo, reutilizado en todos los heroes
        LoadingScreen.tsx          # splash WebGL de logo al primer ingreso (ver docs/HISTORIAL.md)
messages/
  es.json, en.json               # strings de interfaz (nav, botones) — el CONTENIDO vive en Payload
scripts/
  build-image-manifests.cjs      # recalcula los manifiestos de imágenes válidas (ver docs/IMAGENES.md)
  seed-content.ts                 # carga inicial de los globals de contenido (ES)
  seed-agrupacion-home.ts         # carga inicial del global `agrupacion-home`
  translate-en.ts                 # traduce todos los globals + artesanos a `en` (ver nota de bug abajo)
  download_huellas_assets.py      # scrapea huellasdenahuelbuta.cl y descarga sus fotos
  scrape_huellas.py               # scrapea el texto (historia/misión/visión/contacto) del sitio oficial
public/
  media/                          # uploads de Payload (portadas de artesanos)
  pdf-assets/images/               # 385 imágenes embebidas extraídas del PDF fuente
  reference/huellas-oficial/       # ~500 fotos descargadas del sitio oficial
  logo-huellas.png                 # logo completo (emblema + banda de texto "HUELLAS de NAHUELBUTA")
  logo-huellas-emblem.png          # solo el emblema circular, sin texto — para header/footer/favicon
```

## Cómo fluyen los datos

No hay fetch a rutas propias (`/api/artisans`, etc.) — cada server component en
`[locale]/` llama directo a la **Local API** de Payload:

```ts
const payload = await getPayloadClient()
const artisans = await payload.find({ collection: 'artisans', locale, depth: 1 })
```

`depth: 1` es necesario para que la relación `image` (upload) y `category`
vengan resueltas como objeto en vez de solo el id. El único componente cliente
que recibe datos de negocio es `catalog-client.tsx`, y los recibe como props
ya resueltos — filtra en memoria con `useMemo` (40 artesanos es trivial, no
justifica un fetch propio ni estado de loading).

## CMS — colecciones y globals

Todo el contenido editable vive en Payload (`/admin`). Campos marcados
`localized: true` tienen versión independiente por idioma; `fallback: true`
en la config de localización hace que un campo `en` vacío muestre el valor
`es` en vez de quedar en blanco.

**Colecciones**
- `users` — auth, sin campos custom.
- `media` — uploads (`public/media`), `alt`/`caption` localizados.
- `categories` — `id` fijo (slug de las 7 categorías reales), `name` localizado,
  `artisans` es un campo `join` (no se guarda, se calcula desde la relación
  inversa en `artisans.category`).
- `artisans` — `id` fijo al slug (autogenerado desde `name` con un hook
  `beforeValidate` si no viene dado), `bio` es **richText** (Lexical — el único
  campo rich text de todo el proyecto, ver `docs/HISTORIAL.md` para el porqué),
  `image`/`category` son relaciones, `instagram`/`phone`/`location` son texto
  plano sin localizar (datos, no prosa).

**Globals**
- `home-hero` — hero + "memorias" de la vieja portada del catálogo (hoy vive
  dentro de `/brotes-de-chile`).
- `agrupacion-home` — hero + `stats` + `cards` (las 4 tarjetas de navegación)
  de la portada actual del sitio.
- `historia` — hero + `timeline` (array de hitos) + cita de cierre.
- `sobre-nosotros` — hero + misión + visión + `valores` (array).
- `contacto` — datos de contacto (email, dirección, redes) + textos de hero.

Todos los globals y `artisans` tienen el plugin SEO activo
(`meta.title`/`description`/`image` editables desde el admin).

### ⚠️ Bug conocido de Payload con arrays localizados

Los campos `array` con sub-campos `localized: true` (`stats`, `cards`,
`timeline`, `valores`, `memoriasParagraphs`) **pierden el contenido del otro
idioma** si se actualiza el array de un locale sin reusar los mismos `id` de
fila que ya existen en el otro locale — Payload reemplaza todas las filas en
vez de mergear. Cualquier script que escriba estos campos por lote debe leer
primero las filas existentes (en cualquier locale) para reusar sus `id` antes
de guardar la traducción. Ver la función `withIds()` en
`scripts/translate-en.ts` para el patrón de referencia.

## Internacionalización

- `src/i18n/routing.ts` define los locales (`es` default, `en`) y genera el
  matcher de `src/proxy.ts`.
- Todo texto de **interfaz** (botones, nav, labels) sale de
  `messages/es.json` / `messages/en.json` vía `useTranslations()`.
- Todo texto de **contenido** (bios, historia, textos institucionales) sale de
  Payload con el locale de la request — no pasa por `messages/*.json`.
- El selector de idioma en `SiteHeader` usa
  `router.replace(pathname, { locale })` de `@/i18n/navigation`, que preserva
  la ruta actual y solo cambia el prefijo de idioma.

## Estructura del sitio (IA)

`/` es la portada de la **Agrupación Huellas de Nahuelbuta** (la organización),
no el catálogo. El catálogo de los 40 artesanos de "Brotes de Chile" vive en
su propia sub-ruta `/brotes-de-chile`. Ver `docs/HISTORIAL.md` para el porqué
de este cambio.

```
/                    Agrupación (hero, 4 tarjetas, galería de fotos)
/historia             Línea de tiempo institucional
/sobre-nosotros        Misión, visión, valores
/brotes-de-chile        Catálogo de los 40 artesanos (el proyecto original)
/artesano/[id]           Perfil individual de un artesano
/contacto              Datos de contacto de la agrupación
/admin                 Panel de Payload (gestión de todo el contenido)
```

## Mosaicos de fotos (heroes)

Todas las páginas usan `<HeroPhotoGrid>` como fondo del hero, alimentado por
`getHeroPhotoMix()` / `getGalleryPhotos()` en `src/lib/payload.ts` — una
mezcla de tres fuentes: retratos reales de artesanos (Payload/`media`), fotos
de artesanía embebidas en el PDF fuente (`pdf-images.ts`), y fotos reales de
ferias/eventos descargadas del sitio oficial (`official-site-images.ts`).
`sort`/`offset` distintos por página hacen que cada hero muestre una
combinación distinta. El detalle de por qué estas dos últimas fuentes leen un
JSON pre-calculado en vez de escanear `public/` en cada request está en
`docs/IMAGENES.md`.

## Comandos

```bash
npm run dev              # servidor de desarrollo (localhost:3000)
npm run build             # build de producción
npm run seed:content       # carga inicial de los globals de contenido (ES)
node scripts/build-image-manifests.cjs   # recalcula los manifiestos de imágenes (ver docs/IMAGENES.md)
```

Scripts que se corren una sola vez / bajo demanda (no tienen alias en
`package.json`, se invocan directo con `tsx`):

```bash
npx tsx scripts/seed-agrupacion-home.ts   # carga el global agrupacion-home
npx tsx scripts/translate-en.ts            # traduce todo el contenido a `en`
python scripts/download_huellas_assets.py   # re-scrapea fotos del sitio oficial
python scripts/scrape_huellas.py             # re-scrapea texto del sitio oficial
```
