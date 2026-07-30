import path from 'path'
import { fileURLToPath } from 'url'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { seoPlugin } from '@payloadcms/plugin-seo'
import { buildConfig } from 'payload'
import type { CollectionConfig, GlobalConfig } from 'payload'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

function slugify(value: string): string {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(new RegExp('[\\u0300-\\u036f]', 'g'), '')
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
}

const Users: CollectionConfig = {
  slug: 'users',
  auth: true,
  admin: { useAsTitle: 'email' },
  fields: [],
}

const Media: CollectionConfig = {
  slug: 'media',
  upload: {
    staticDir: path.resolve(dirname, 'public/media'),
    mimeTypes: ['image/*'],
  },
  access: { read: () => true },
  fields: [
    { name: 'alt', type: 'text', localized: true, required: true },
    { name: 'caption', type: 'text', localized: true },
  ],
}

const Categories: CollectionConfig = {
  slug: 'categories',
  access: { read: () => true },
  admin: { useAsTitle: 'name' },
  fields: [
    { name: 'id', type: 'text' },
    { name: 'name', type: 'text', localized: true, required: true, unique: true },
    {
      name: 'artisans',
      type: 'join',
      collection: 'artisans',
      on: 'category',
    },
  ],
}

const Artisans: CollectionConfig = {
  slug: 'artisans',
  access: { read: () => true },
  admin: { useAsTitle: 'name', defaultColumns: ['name', 'craft', 'location', 'category'] },
  fields: [
    { name: 'id', type: 'text' },
    { name: 'name', type: 'text', localized: true, required: true, unique: true },
    { name: 'bio', type: 'richText', localized: true, editor: lexicalEditor() },
    { name: 'image', type: 'upload', relationTo: 'media' },
    { name: 'initials', type: 'text' },
    { name: 'category', type: 'relationship', relationTo: 'categories', required: true },
    { name: 'instagram', type: 'text' },
    { name: 'phone', type: 'text' },
    { name: 'location', type: 'text' },
    { name: 'craft', type: 'text', localized: true },
  ],
  hooks: {
    beforeValidate: [
      ({ data, operation }) => {
        if (operation === 'create' && data && !data.id && data.name) {
          data.id = slugify(data.name)
        }
        return data
      },
    ],
  },
}

const HomeHero: GlobalConfig = {
  slug: 'home-hero',
  fields: [
    { name: 'tag', type: 'text', localized: true },
    { name: 'titlePrefix', type: 'text', localized: true },
    { name: 'titleEmphasis', type: 'text', localized: true },
    { name: 'subtitle', type: 'textarea', localized: true },
    {
      name: 'stats',
      type: 'array',
      fields: [
        { name: 'value', type: 'text' },
        { name: 'label', type: 'text', localized: true },
      ],
    },
    { name: 'memoriasTag', type: 'text', localized: true },
    { name: 'memoriasTitle', type: 'text', localized: true },
    { name: 'memoriasLead', type: 'textarea', localized: true },
    {
      name: 'memoriasParagraphs',
      type: 'array',
      fields: [{ name: 'text', type: 'textarea', localized: true }],
    },
  ],
}

const Historia: GlobalConfig = {
  slug: 'historia',
  fields: [
    { name: 'heroTitle', type: 'text', localized: true },
    { name: 'heroIntro', type: 'textarea', localized: true },
    {
      name: 'timeline',
      type: 'array',
      fields: [
        { name: 'date', type: 'text', localized: true },
        { name: 'title', type: 'text', localized: true },
        { name: 'body', type: 'textarea', localized: true },
      ],
    },
    { name: 'closingQuote', type: 'textarea', localized: true },
  ],
}

const SobreNosotros: GlobalConfig = {
  slug: 'sobre-nosotros',
  fields: [
    { name: 'heroTitle', type: 'text', localized: true },
    { name: 'mision', type: 'textarea', localized: true },
    { name: 'vision', type: 'textarea', localized: true },
    {
      name: 'valores',
      type: 'array',
      fields: [
        { name: 'icon', type: 'text' },
        { name: 'title', type: 'text', localized: true },
        { name: 'body', type: 'textarea', localized: true },
      ],
    },
  ],
}

const AgrupacionHome: GlobalConfig = {
  slug: 'agrupacion-home',
  fields: [
    { name: 'tag', type: 'text', localized: true },
    { name: 'titlePrefix', type: 'text', localized: true },
    { name: 'titleEmphasis', type: 'text', localized: true },
    { name: 'subtitle', type: 'textarea', localized: true },
    {
      name: 'stats',
      type: 'array',
      fields: [
        { name: 'value', type: 'text' },
        { name: 'label', type: 'text', localized: true },
      ],
    },
    {
      name: 'cards',
      type: 'array',
      fields: [
        { name: 'title', type: 'text', localized: true },
        { name: 'description', type: 'textarea', localized: true },
        { name: 'href', type: 'text' },
      ],
    },
  ],
}

const Contacto: GlobalConfig = {
  slug: 'contacto',
  fields: [
    { name: 'heroTitle', type: 'text', localized: true },
    { name: 'intro', type: 'textarea', localized: true },
    { name: 'email', type: 'text' },
    { name: 'address', type: 'text' },
    { name: 'instagramUrl', type: 'text' },
    { name: 'facebookUrl', type: 'text' },
    { name: 'orgName', type: 'text' },
  ],
}

export default buildConfig({
  secret: process.env.PAYLOAD_SECRET!,
  admin: { user: Users.slug },
  collections: [Users, Media, Categories, Artisans],
  globals: [HomeHero, AgrupacionHome, Historia, SobreNosotros, Contacto],
  editor: lexicalEditor(),
  localization: {
    locales: [
      { code: 'es', label: 'Español' },
      { code: 'en', label: 'English' },
    ],
    defaultLocale: 'es',
    fallback: true,
  },
  db: postgresAdapter({
    pool: { connectionString: process.env.DATABASE_URL },
    // Isolated from Prisma's tables (which live in `public`) so Drizzle's dev-mode
    // schema push never mistakes an existing Prisma table for a rename candidate.
    schemaName: 'payload',
  }),
  typescript: {
    outputFile: path.resolve(dirname, 'src/payload-types.ts'),
  },
  plugins: [
    seoPlugin({
      collections: ['artisans'],
      globals: ['home-hero', 'agrupacion-home', 'historia', 'sobre-nosotros', 'contacto'],
      uploadsCollection: 'media',
      generateTitle: ({ doc }) =>
        doc?.name ? `${doc.name} | Brotes de Chile` : 'Brotes de Chile',
      generateURL: ({ doc }) => `https://brotesdechile.cl/artesano/${doc?.id ?? ''}`,
    }),
  ],
})
