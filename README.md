# 🌿 Catálogo Digital: Brotes de Chile 2026

Plataforma oficial del catálogo digital de artesanos para la "Muestra de Arte Popular Brotes de Chile 2026" en Angol. Desarrollado con una arquitectura moderna enfocada en rendimiento, SEO y accesibilidad (WCAG 2.2).

## 🚀 Tecnologías Principales (Tech Stack)

- **Framework:** Next.js 16 (App Router)
- **Lenguaje:** TypeScript
- **Estilos:** Tailwind CSS 4 + Variables CSS Nativas (Diseño Premium)
- **Animaciones:** Framer Motion
- **Base de Datos:** PostgreSQL
- **ORM:** Prisma
- **Validación de Datos:** Zod
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

### 4. Sincronizar el esquema de Prisma
Esto creará las tablas necesarias en tu base de datos local según el archivo `schema.prisma`.
```bash
npx prisma db push
```

### 5. Sembrar la Base de Datos (Seed)
Este comando insertará los 40 artesanos y las 7 categorías iniciales.
```bash
npm run db:seed
```

### 6. Levantar el entorno de desarrollo
```bash
npm run dev
```

El catálogo estará disponible en [http://localhost:3000](http://localhost:3000).

---

## 📂 Estructura Principal del Proyecto

- `prisma/` - Contiene el esquema de BD (`schema.prisma`) y el script de extracción de datos inicial (`seed.ts`).
- `src/app/` - Rutas principales de Next.js (Frontend y Backend).
  - `api/` - Endpoints REST (ej. `/api/artisans`) validados con Zod.
  - `artesano/[id]/` - Páginas individuales de perfiles dinámicos con SEO OpenGraph.
  - `catalog-client.tsx` - Componente principal de la grilla, filtros y animaciones.
  - `globals.css` - Sistema de diseño principal, variables y reglas de accesibilidad.

## ✅ Accesibilidad (a11y)
El proyecto cumple con las normativas **WCAG 2.2**:
- Implementación de `skip-link` para navegación ágil por teclado.
- Uso correcto de `aria-labels` y `aria-hidden`.
- Indicadores visuales claros mediante `:focus-visible`.

## 📌 Próximos Pasos (Roadmap)
- Configuración de Dockerfile para la aplicación Next.js.
- Despliegue de integración continua (CI/CD) con GitHub Actions.
