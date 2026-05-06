import { z } from 'zod'

export const getArtisansSchema = z.object({
  category: z.string().optional(),
  q: z.string().optional()
})

// En el futuro, si se requiere un endpoint POST para crear artesanos:
export const createArtisanSchema = z.object({
  name: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  bio: z.string().optional(),
  categoryId: z.string(),
  location: z.string().optional(),
  craft: z.string().optional(),
  instagram: z.string().optional(),
  phone: z.string().optional(),
})
