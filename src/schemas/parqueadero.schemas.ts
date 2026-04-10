import z from "zod";

export const createParqueaderoSchema = z.object({
  nombre: z.string().min(3, "Nombre inválido"),
  capacidadMaxima: z.number().int().positive(),
  requierePago: z.boolean(),
});

export const updateParqueaderoSchema = z.object({
  nombre: z.string().optional(),
  capacidadMaxima: z.number().int().positive().optional(),
  requierePago: z.boolean().optional(),
});