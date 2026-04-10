import z from "zod";

export const createIngresoSchema = z.object({
  placa: z.string().min(5),
  idParqueadero: z.number().int().positive(),
});


