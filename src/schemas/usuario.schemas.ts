import z from "zod";

export const createUsuarioSchema = z.object({
  nombreCompleto: z
    .string()
    .nonempty("El nombre completo es obligatorio")
    .min(3, "Debe tener al menos 3 caracteres"),

  correo: z
    .string()
    .nonempty("El correo es obligatorio")
    .email("El correo debe tener un formato válido"),

  contrasena: z
    .string()
    .nonempty("La contraseña es obligatoria")
    .min(6, "La contraseña debe tener al menos 6 caracteres"),

  documento: z
    .string()
    .nonempty("El documento es obligatorio")
    .min(5, "El documento debe tener al menos 5 caracteres"),
});

export const updateUsuarioSchema = z.object({
  nombreCompleto: z
    .string()
    .min(3, "Debe tener al menos 3 caracteres")
    .optional(),

  correo: z
    .string()
    .email("Correo inválido")
    .optional(),

  contrasena: z
    .string()
    .min(6, "La contraseña debe tener al menos 6 caracteres")
    .optional(),

  documento: z
    .string()
    .min(5, "Documento inválido")
    .optional(),
});

export const loginUsuarioSchema = z.object({
  correo: z
    .string()
    .nonempty("El correo es obligatorio")
    .email("Debe ingresar un correo válido"),

  contrasena: z
    .string()
    .nonempty("La contraseña es obligatoria"),
});