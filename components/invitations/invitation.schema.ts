import { z } from 'zod'

export const roleOptions = [
  { label: 'Viewer (lecture seule)', value: 'VIEWER' },
  { label: 'Contributor (peut contribuer)', value: 'CONTRIBUTOR' },
  { label: 'Manager (peut gérer)', value: 'MANAGER' },
  { label: 'Admin (tous les droits)', value: 'ADMIN' },
] as const

export const invitationFormSchema = z.object({
  email: z.string().email('Email invalide').min(1, 'Email requis'),
  message: z.string().optional(),
  role: z.enum(['ADMIN', 'MANAGER', 'CONTRIBUTOR', 'VIEWER', 'PUBLIC']).default('VIEWER'),
})

export type InvitationFormData = z.infer<typeof invitationFormSchema>

export const invitationFormSetValues = (data?: Partial<InvitationFormData>): InvitationFormData => ({
  email: data?.email || '',
  message: data?.message || '',
  role: data?.role || 'VIEWER',
})
