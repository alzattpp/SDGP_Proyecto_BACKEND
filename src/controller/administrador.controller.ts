import { Request, Response } from "express";
import { HttpStatusCode } from "axios";
import {
  getAdministradores_get,
  getAdministradorById_get,
  createAdministrador_post,
  updateAdministrador_put,
  deleteAdministrador_delete
} from "../models/administrador.model";

import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const secretKey = "clave-secreta";

// 🔹 GET ALL
export async function getAdministradores(req: Request, res: Response): Promise<Response> {
  const data = await getAdministradores_get();
  return res.status(HttpStatusCode.Ok).json({ data });
}

// 🔹 GET BY ID
export async function getAdministradorById(req: Request, res: Response): Promise<Response> {
  const { id } = req.params;

  const data = await getAdministradorById_get(Number(id));

  if (!data) {
    return res.status(HttpStatusCode.NotFound).json({ message: "No encontrado" });
  }

  return res.status(HttpStatusCode.Ok).json({ data });
}

// 🔹 CREATE
export async function createAdministrador(req: Request, res: Response): Promise<Response> {
  try {
    const { nombreCompleto, correo, contrasena, documento } = req.body;

    const encryptedPass = bcrypt.hashSync(contrasena, 10);

    const success = await createAdministrador_post({
      nombreCompleto,
      correo,
      contrasena: encryptedPass,
      documento,
    });

    if (!success) {
      return res.status(HttpStatusCode.BadRequest).json({ message: "No se pudo crear" });
    }

    return res.status(HttpStatusCode.Ok).json({ message: "Administrador creado" });

  } catch (error) {
    return res.status(HttpStatusCode.InternalServerError).json({ message: "Error servidor" });
  }
}

// 🔹 UPDATE
export async function updateAdministrador(req: Request, res: Response): Promise<Response> {
  try {
    const { id } = req.params;
    const { idUsuario, nombreCompleto, correo, contrasena, documento } = req.body;

    const encryptedPass = contrasena ? bcrypt.hashSync(contrasena, 10) : contrasena;

    const success = await updateAdministrador_put({
      idAdmin: Number(id),
      idUsuario,
      nombreCompleto,
      correo,
      contrasena: encryptedPass,
      documento,
    });

    if (!success) {
      return res.status(HttpStatusCode.BadRequest).json({ message: "No se pudo actualizar" });
    }

    return res.status(HttpStatusCode.Ok).json({ message: "Actualizado correctamente" });

  } catch (error) {
    return res.status(HttpStatusCode.InternalServerError).json({ message: "Error servidor" });
  }
}

// 🔹 DELETE
export async function deleteAdministrador(req: Request, res: Response): Promise<Response> {
  const { idUsuario } = req.params;

  const success = await deleteAdministrador_delete(Number(idUsuario));

  if (!success) {
    return res.status(HttpStatusCode.BadRequest).json({ message: "No se pudo eliminar" });
  }

  return res.status(HttpStatusCode.Ok).json({ message: "Eliminado correctamente" });
}

// 🔹 GET /me ADMIN
export async function getCurrentAdministrador(req: Request, res: Response): Promise<Response> {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(HttpStatusCode.Unauthorized).json({ message: "No autenticado" });
    }

    const decoded: any = jwt.verify(token, secretKey);

    // 🔥 VALIDAMOS ROL
    if (decoded.rol !== "admin") {
      return res.status(HttpStatusCode.Forbidden).json({ message: "No autorizado" });
    }

    // 🔥 buscamos el admin por idUsuario
    const admins = await getAdministradores_get();

    const admin = admins.find(
      (a) => a.idUsuario === Number(decoded.userId)
    );

    if (!admin) {
      return res.status(HttpStatusCode.NotFound).json({ message: "Administrador no encontrado" });
    }

    return res.status(HttpStatusCode.Ok).json({
      data: admin,
      rol: decoded.rol
    });

  } catch (error) {
    console.error(error);
    return res.status(HttpStatusCode.InternalServerError).json({ message: "Error al verificar sesión" });
  }
}