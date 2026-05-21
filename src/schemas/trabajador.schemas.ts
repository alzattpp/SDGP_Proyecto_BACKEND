import z from "zod";

export const createTrabajadorSchema = z.object({
  nombreCompleto: z
    .string()
    .nonempty("El nombre es obligatorio")
    .min(3, "Debe tener al menos 3 caracteres"),

  correo: z
    .string()
    .nonempty("El correo es obligatorio")
    .email("Correo inválido"),

  contrasena: z
    .string()
    .nonempty("La contraseña es obligatoria")
    .min(6, "Mínimo 6 caracteres"),

  documento: z
    .string()
    .nonempty("El documento es obligatorio")
    .min(5, "Documento inválido"),

  telefono: z
    .string()
    .nonempty("El teléfono es obligatorio"),

  idParqueadero: z
    .number()
    .int("Debe ser entero")
    .positive("Debe ser positivo"),
});

export const updateTrabajadorSchema = z.object({
  idUsuario: z.number().int().positive().optional(),

  nombreCompleto: z.string().min(3).optional(),

  correo: z.string().email().optional(),

  contrasena: z.string().min(6).optional(),

  documento: z.string().min(5).optional(),

  telefono: z.string().optional(),

  idParqueadero: z.number().int().positive().optional(),
});