import { z } from 'zod'

export const mixtapeFormSchema = z.object({
  name: z.string().min(1, 'Nom requis'),
  year: z.string().regex(/^\d+$/, 'Année invalide'),
  cover: z
    .object({
      filename: z.string().optional(),
      file: z.instanceof(File).optional(),
      alt: z.string().optional(),
      bucket: z.string().nullable().optional(),
      url: z.string().optional(),
    })
    .optional(),
  djsAsText: z.string().min(1, 'Djs requis'),
  tracksAsText: z.string().nullable().optional(),
  tracks: z
    .array(
      z.object({
        position: z.number().optional(),
        artist: z.string().min(1, 'Artiste requis'),
        title: z.string().min(1, 'Titre requis'),
        start_at: z.string().nullable().optional(),
      }),
    )
    .optional()
    .transform((v) => v ?? []),
  tags: z
    .array(
      z.object({
        id: z.string().nullable().optional(),
        name: z.string().min(1, 'Nom requis'),
        color: z.string().nullable().optional(),
        createdAt: z.string().nullable().optional(),
        updatedAt: z.string().nullable().optional(),
      }),
    )
    .nullable()
    .default([]),
  comment: z.string().nullable().optional(),
})

export type MixtapeFormData = z.infer<typeof mixtapeFormSchema>

export const mixtapeFormSetValues = (data?: MixtapeFormData) => {
  const currentYear = new Date().getFullYear().toString()
  return {
    name: data?.name || '',
    year: data?.year || currentYear,
    cover: data?.cover
      ? {
          bucket: data?.cover?.bucket,
          filename: data?.cover?.filename,
          url: data?.cover?.url,
          alt: data?.cover?.alt,
        }
      : undefined,
    djsAsText: data?.djsAsText || '',
    tracksAsText: data?.tracksAsText || '',
    tracks: data?.tracks || [],
    tags: data?.tags || [],
    comment: data?.comment || '',
  }
}
