import z from "zod";

// 🔹 CREATE
export const createMedioPagoSchema = z.object({
  idUsuario: z.number().int().positive(),

  tipo: z.string()
    .min(1, "el tipo es obligatorio"),

  numeroReferencia: z.string()
    .min(4, "numero de referencia invalido"),

  cvv: z.string()
    .min(3, "cvv invalido")
    .max(4, "cvv invalido")
    .optional()
});


// 🔹 UPDATE
export const updateMedioPagoSchema = z.object({

  tipo: z.string()
    .min(1)
    .optional(),

  numeroReferencia: z.string()
    .min(4)
    .optional(),

  cvv: z.string()
    .min(3)
    .max(4)
    .optional(),

  estado: z.string()
    .optional()

});