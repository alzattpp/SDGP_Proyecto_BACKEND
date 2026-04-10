import { Request, Response } from "express";
import { HttpStatusCode } from "axios";
import {
  getUsuarios_get,
  getUsuarioById_get,
  createUsuario_post,
  updateUsuario_put,
  deleteUsuario_delete,
} from "../models/usuario.model";

import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const secretKey = "clave-secreta";

// 🔹 LOGIN
export async function loginUsuario(req: Request, res: Response): Promise<Response> {
  try {
    const { correo, contrasena } = req.body;

    const usuarios = await getUsuarios_get();
    const usuario = usuarios.find((u) => u.correo === correo);

    if (!usuario) {
      return res.status(HttpStatusCode.Unauthorized).json({ message: "Usuario no encontrado" });
    }

    const validPassword = await bcrypt.compare(contrasena, usuario.contrasena);
    if (!validPassword) {
      return res.status(HttpStatusCode.Unauthorized).json({ message: "Contraseña incorrecta" });
    }

    const token = jwt.sign(
      { userId: usuario.idUsuario },
      secretKey,
      { expiresIn: "1h" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 3600000,
    });

    return res.status(HttpStatusCode.Ok).json({ message: "Login exitoso" });

  } catch (error) {
    console.error(error);
    return res.status(HttpStatusCode.InternalServerError).json({ message: "Error en el servidor" });
  }
}

// 🔹 GET all
export async function getUsuarios(req: Request, res: Response): Promise<Response> {
  try {
    const usuarios = await getUsuarios_get();
    return res.status(HttpStatusCode.Ok).json({ data: usuarios });
  } catch (error) {
    return res.status(HttpStatusCode.InternalServerError).json({ message: "Error al obtener usuarios" });
  }
}

// 🔹 GET /me
export async function getCurrentUsuario(req: Request, res: Response): Promise<Response> {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(HttpStatusCode.Unauthorized).json({ message: "No autenticado" });
    }

    const decoded: any = jwt.verify(token, secretKey);
    const userId = decoded.userId;

    const usuario = await getUsuarioById_get(Number(userId));

    if (!usuario) {
      return res.status(HttpStatusCode.NotFound).json({ message: "Usuario no encontrado" });
    }

    return res.status(HttpStatusCode.Ok).json({ data: usuario });

  } catch (error) {
    console.error(error);
    return res.status(HttpStatusCode.InternalServerError).json({ message: "Error al verificar sesión" });
  }
}

// 🔹 GET by ID
export async function getUsuarioById(req: Request, res: Response): Promise<Response> {
  try {
    const { id } = req.params;
    const usuario = await getUsuarioById_get(Number(id));

    if (!usuario) {
      return res.status(HttpStatusCode.NotFound).json({ message: "Usuario no encontrado" });
    }

    return res.status(HttpStatusCode.Ok).json({ data: usuario });

  } catch (error) {
    return res.status(HttpStatusCode.InternalServerError).json({ message: "Error en el servidor" });
  }
}

// 🔹 POST create
export async function createUsuario(req: Request, res: Response): Promise<Response> {
  try {
    const { nombreCompleto, correo, contrasena, documento } = req.body;

    const passSalt = bcrypt.genSaltSync(10);
    const encryptedPass = bcrypt.hashSync(contrasena, passSalt);

    const success = await createUsuario_post({
      nombreCompleto,
      correo,
      contrasena: encryptedPass,
      documento,
    });

    if (!success) {
      return res.status(HttpStatusCode.BadRequest).json({ message: "No se pudo crear el usuario" });
    }

    return res.status(HttpStatusCode.Ok).json({ message: "Usuario creado correctamente" });

  } catch (error) {
    console.error(error);
    return res.status(HttpStatusCode.InternalServerError).json({ message: "Error en el servidor" });
  }
}

// 🔹 PUT update
export async function updateUsuario(req: Request, res: Response): Promise<Response> {
  try {
    const { id } = req.params;
    const { nombreCompleto, correo, contrasena, documento } = req.body;

    let encryptedPass = contrasena;
    if (contrasena) {
      encryptedPass = bcrypt.hashSync(contrasena, 10);
    }

    const success = await updateUsuario_put({
      idUsuario: Number(id),
      nombreCompleto,
      correo,
      contrasena: encryptedPass,
      documento,
    });

    if (!success) {
      return res.status(HttpStatusCode.BadRequest).json({ message: "No se pudo actualizar el usuario" });
    }

    return res.status(HttpStatusCode.Ok).json({ message: "Usuario actualizado correctamente" });

  } catch (error) {
    console.error(error);
    return res.status(HttpStatusCode.InternalServerError).json({ message: "Error en el servidor" });
  }
}

// 🔹 DELETE eliminar
export async function deleteUsuario(req: Request, res: Response): Promise<Response> {
  try {
    const { id } = req.params;

    const success = await deleteUsuario_delete(Number(id));

    if (!success) {
      return res.status(HttpStatusCode.BadRequest).json({ message: "No se pudo eliminar el usuario" });
    }

    return res.status(HttpStatusCode.Ok).json({ message: "Usuario eliminado correctamente" });

  } catch (error) {
    console.error(error);
    return res.status(HttpStatusCode.InternalServerError).json({ message: "Error en el servidor" });
  }
}

// 🔹 LOGOUT
export function logoutUsuario(req: Request, res: Response): Response {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    return res.status(HttpStatusCode.Ok).json({ message: "Logout exitoso" });

  } catch (error) {
    console.error(error);
    return res.status(HttpStatusCode.InternalServerError).json({ message: "Error al cerrar sesión" });
  }
}