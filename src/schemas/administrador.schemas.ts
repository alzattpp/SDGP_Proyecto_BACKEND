import z from "zod";

export const createAdministradorSchema = z.object({
  nombreCompleto: z.string().min(3),
  correo: z.string().email(),
  contrasena: z.string().min(6),
  documento: z.string().min(5),
});

export const updateAdministradorSchema = z.object({
  idUsuario: z.number().int().positive(),
  nombreCompleto: z.string().min(3).optional(),
  correo: z.string().email().optional(),
  contrasena: z.string().min(6).optional(),
  documento: z.string().min(5).optional(),
});