import z from "zod";

export const createVehiculoSchema = z.object({
  placa: z.string().min(5, "Placa inválida"),
  idUsuario: z.number().int().positive(),
  marca: z.string().nonempty("Marca obligatoria"),
});

export const updateVehiculoSchema = z.object({
  idUsuario: z.number().int().positive().optional(),
  marca: z.string().optional(),
});