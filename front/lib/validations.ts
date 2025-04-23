import { z } from 'zod'

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email é obrigatório')
    .email('Email inválido'),
  password: z
    .string()
    .min(1, 'Senha é obrigatória')
    .min(6, 'A senha deve ter pelo menos 6 caracteres'),
})

export const eventSchema = z.object({
  title: z
    .string()
    .min(1, 'Título é obrigatório')
    .max(100, 'Título deve ter no máximo 100 caracteres'),
  description: z
    .string()
    .min(1, 'Descrição é obrigatória')
    .max(500, 'Descrição deve ter no máximo 500 caracteres'),
  date: z
    .string()
    .min(1, 'Data é obrigatória')
    .refine((date) => new Date(date) > new Date(), {
      message: 'A data deve ser futura',
    }),
  location: z
    .string()
    .min(1, 'Local é obrigatório')
    .max(200, 'Local deve ter no máximo 200 caracteres'),
  capacity: z
    .number()
    .min(1, 'Capacidade deve ser maior que 0')
    .max(1000, 'Capacidade deve ser menor que 1000'),
  price: z
    .number()
    .min(0, 'Preço não pode ser negativo')
    .max(10000, 'Preço deve ser menor que 10000'),
})

export const userSchema = z.object({
  name: z
    .string()
    .min(1, 'Nome é obrigatório')
    .max(100, 'Nome deve ter no máximo 100 caracteres'),
  email: z
    .string()
    .min(1, 'Email é obrigatório')
    .email('Email inválido'),
  password: z
    .string()
    .min(6, 'A senha deve ter pelo menos 6 caracteres')
    .optional(),
  confirmPassword: z
    .string()
    .optional()
    .refine((val, ctx) => {
      if (ctx.parent.password && val !== ctx.parent.password) {
        return false
      }
      return true
    }, 'As senhas não coincidem'),
})

export type LoginFormData = z.infer<typeof loginSchema>
export type EventFormData = z.infer<typeof eventSchema>
export type UserFormData = z.infer<typeof userSchema> 