# 🌿 Huellas de Nahuelbuta

Sitio de la Agrupación de Artesanos y Productores Huellas de Nahuelbuta, que
incluye el catálogo digital de la "Muestra de Arte Popular Brotes de Chile
2026" (`/brotes-de-chile`) en Angol. Desarrollado con una arquitectura
moderna enfocada en rendimiento, SEO y accesibilidad (WCAG 2.2), con
contenido administrable en dos idiomas (ES/EN) desde un CMS propio.

📚 **Documentación completa:** [`docs/ARQUITECTURA.md`](docs/ARQUITECTURA.md)
(cómo está armado), [`docs/HISTORIAL.md`](docs/HISTORIAL.md) (qué se hizo y
por qué), [`docs/IMAGENES.md`](docs/IMAGENES.md) (pipeline de fotos y bugs
resueltos), [`docs/DEPLOY.md`](docs/DEPLOY.md) (despliegue en producción,
`huellas.adelchen.cl`), [`task.md`](task.md) (pendientes actuales).

## 🚀 Tecnologías Principales (Tech Stack)

- **Framework:** Next.js 16 (App Router)
- **Lenguaje:** TypeScript
- **CMS:** Payload CMS 3 (self-hosted, admin en `/admin`)
- **Multiidioma:** next-intl (rutas `/es/...` y `/en/...`)
- **Estilos:** Tailwind CSS 4 + Variables CSS Nativas (Diseño Premium)
- **Animaciones:** Framer Motion
- **Base de Datos:** PostgreSQL (tablas de Payload aisladas en el schema `payload`)
- **Contenedores:** Docker & Docker Compose

---

## 🛠️ Instalación y Configuración Local (Paso a Paso)

Si estás clonando el repositorio por primera vez en un nuevo equipo, sigue estos pasos exactamente en este orden para levantar el proyecto:

### 1. Clonar el repositorio
```bash
git clone https://github.com/yordyy-eng/brotesartesanos.git
cd brotesartesanos
```

### 2. Instalar dependencias
```bash
npm install
```

### 3. Levantar la Base de Datos (PostgreSQL)
Asegúrate de tener Docker Desktop abierto y ejecutándose en tu equipo.
```bash
docker-compose up -d
```

### 4. Variables de entorno
Copia `.env` (o créalo) con `DATABASE_URL`, `PAYLOAD_SECRET` y `PAYLOAD_PUBLIC_SERVER_URL`. Payload crea su propio esquema (`payload`) en la misma base de datos automáticamente al arrancar — no hace falta un paso de migración manual en desarrollo.

### 5. Levantar el entorno de desarrollo
```bash
npm run dev
```

El catálogo estará disponible en [http://localhost:3000](http://localhost:3000) (redirige a `/es`) y el panel de administración en [http://localhost:3000/admin](http://localhost:3000/admin).

Si es la primera vez que se levanta contra una base de datos vacía, hay que crear el primer usuario admin desde `/admin` y cargar los datos: ver `scripts/seed-content.ts` para el contenido institucional (Historia/Sobre Nosotros/Contacto/Hero) — `npm run seed:content`. Los 40 artesanos se cargan y editan directamente desde el panel de administración.

---

## 📂 Estructura Principal del Proyecto

Ver [`docs/ARQUITECTURA.md`](docs/ARQUITECTURA.md) para el mapa completo de
carpetas, el esquema de colecciones/globals de Payload, y cómo fluyen los
datos. Resumen rápido:

- `payload.config.ts` - Configuración de Payload: colecciones (`Artisans`, `Categories`, `Media`, `Users`) y globals de contenido (`HomeHero`, `AgrupacionHome`, `Historia`, `SobreNosotros`, `Contacto`).
- `src/app/(payload)/` - Rutas generadas por Payload (`/admin`, API REST) — no editar a mano.
- `src/app/[locale]/` - Rutas de la app en ambos idiomas.
  - `page.tsx` - Portada de la Agrupación (no el catálogo).
  - `brotes-de-chile/` - El catálogo de los 40 artesanos (hero + grid filtrable).
  - `artesano/[id]/` - Páginas individuales de perfiles dinámicos con SEO OpenGraph.
  - `historia/`, `sobre-nosotros/`, `contacto/` - Páginas institucionales editables desde el CMS.
  - `_components/SiteHeader.tsx`, `_components/Footer.tsx` - Navegación y pie de página compartidos (con el logo de la agrupación).
- `src/i18n/` - Configuración de next-intl (rutas, mensajes de UI estáticos).
- `messages/es.json`, `messages/en.json` - Strings de interfaz (no contenido de negocio, ese vive en Payload).
- `src/lib/payload.ts` - Cliente de Payload (Local API) reusado en los server components.
- `src/app/globals.css` - Sistema de diseño principal, variables y reglas de accesibilidad.

## ✅ Accesibilidad (a11y)
El proyecto cumple con las normativas **WCAG 2.2**:
- Implementación de `skip-link` para navegación ágil por teclado.
- Uso correcto de `aria-labels` y `aria-hidden`.
- Indicadores visuales claros mediante `:focus-visible`.

## 📌 Próximos Pasos (Roadmap)
Ver la sección **To Do** y **Backlog** de [`task.md`](task.md) para el
listado actualizado de pendientes (contenido por revisar, tienda online, bot
de orientación, CI/CD, despliegue).
