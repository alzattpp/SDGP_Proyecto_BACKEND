import z from "zod";

// 🔹 CREATE
export const createPagoSchema = z.object({

  idIngreso: z.number()
    .int()
    .positive()
    .optional(),

  idUsuario: z.number()
    .int()
    .positive(),

  idMedioPago: z.number()
    .int()
    .positive(),

  monto: z.number()
    .positive()

});


// 🔹 UPDATE
export const updatePagoSchema = z.object({

  idIngreso: z.number()
    .int()
    .positive()
    .optional(),

  idUsuario: z.number()
    .int()
    .positive()
    .optional(),

  idMedioPago: z.number()
    .int()
    .positive()
    .optional(),

  monto: z.number()
    .positive()
    .optional(),

  estado: z.string()
    .optional()

});