import { Request, Response } from "express";
import { HttpStatusCode } from "axios";
import {
  getTrabajadores_get,
  getTrabajadorById_get,
  createTrabajador_post,
  updateTrabajador_put,
  deleteTrabajador_delete,
} from "../models/trabajador.model";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const secretKey = "clave-secreta";

// 🔹 GET ALL
export async function getTrabajadores(req: Request, res: Response): Promise<Response> {
  try {
    const data = await getTrabajadores_get();
    return res.status(HttpStatusCode.Ok).json({ data });
  } catch (error) {
    return res.status(HttpStatusCode.InternalServerError).json({ message: "Error al obtener trabajadores" });
  }
}

// 🔹 GET BY ID
export async function getTrabajadorById(req: Request, res: Response): Promise<Response> {
  try {
    const { id } = req.params;

    const data = await getTrabajadorById_get(Number(id));

    if (!data) {
      return res.status(HttpStatusCode.NotFound).json({ message: "Trabajador no encontrado" });
    }

    return res.status(HttpStatusCode.Ok).json({ data });

  } catch (error) {
    return res.status(HttpStatusCode.InternalServerError).json({ message: "Error en el servidor" });
  }
}

// 🔹 CREATE
export async function createTrabajador(req: Request, res: Response): Promise<Response> {
  try {
    const { nombreCompleto, correo, contrasena, documento, telefono, idParqueadero } = req.body;

    const encryptedPass = bcrypt.hashSync(contrasena, 10);

    const success = await createTrabajador_post({
      nombreCompleto,
      correo,
      contrasena: encryptedPass,
      documento,
      telefono,
      idParqueadero,
    });

    if (!success) {
      return res.status(HttpStatusCode.BadRequest).json({ message: "No se pudo crear el trabajador" });
    }

    return res.status(HttpStatusCode.Ok).json({ message: "Trabajador creado correctamente" });

  } catch (error) {
    console.error(error);
    return res.status(HttpStatusCode.InternalServerError).json({ message: "Error en el servidor" });
  }
}

// 🔹 UPDATE
export async function updateTrabajador(req: Request, res: Response): Promise<Response> {
  try {
    const { id } = req.params;
    const { idUsuario, nombreCompleto, correo, contrasena, documento, telefono, idParqueadero } = req.body;

    const encryptedPass = contrasena ? bcrypt.hashSync(contrasena, 10) : contrasena;

    const success = await updateTrabajador_put({
      idTrabajador: Number(id),
      idUsuario,
      nombreCompleto,
      correo,
      contrasena: encryptedPass,
      documento,
      telefono,
      idParqueadero,
    });

    if (!success) {
      return res.status(HttpStatusCode.BadRequest).json({ message: "No se pudo actualizar" });
    }

    return res.status(HttpStatusCode.Ok).json({ message: "Trabajador actualizado correctamente" });

  } catch (error) {
    console.error(error);
    return res.status(HttpStatusCode.InternalServerError).json({ message: "Error en el servidor" });
  }
}

// 🔹 DELETE
export async function deleteTrabajador(req: Request, res: Response): Promise<Response> {
  try {
    const { idUsuario } = req.params;

    const success = await deleteTrabajador_delete(Number(idUsuario));

    if (!success) {
      return res.status(HttpStatusCode.BadRequest).json({ message: "No se pudo eliminar" });
    }

    return res.status(HttpStatusCode.Ok).json({ message: "Trabajador eliminado correctamente" });

  } catch (error) {
    console.error(error);
    return res.status(HttpStatusCode.InternalServerError).json({ message: "Error en el servidor" });
  }
}
// 🔹 GET /me TRABAJADOR
export async function getCurrentTrabajador(req: Request, res: Response): Promise<Response> {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(HttpStatusCode.Unauthorized).json({ message: "No autenticado" });
    }

    const decoded: any = jwt.verify(token, secretKey);

    // 🔥 VALIDAMOS QUE SEA TRABAJADOR
    if (decoded.rol !== "trabajador") {
      return res.status(HttpStatusCode.Forbidden).json({ message: "No autorizado" });
    }

    // 🔥 buscamos trabajador por idUsuario
    const trabajadores = await getTrabajadores_get();

    const trabajador = trabajadores.find(
      (t) => t.idUsuario === Number(decoded.userId)
    );

    if (!trabajador) {
      return res.status(HttpStatusCode.NotFound).json({ message: "Trabajador no encontrado" });
    }

    return res.status(HttpStatusCode.Ok).json({
      data: trabajador,
      rol: decoded.rol
    });

  } catch (error) {
    console.error(error);
    return res.status(HttpStatusCode.InternalServerError).json({ message: "Error al verificar sesión" });
  }
}