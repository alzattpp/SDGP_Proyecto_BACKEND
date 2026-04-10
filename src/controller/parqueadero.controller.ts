import { Request, Response } from "express";
import { HttpStatusCode } from "axios";
import {
  getParqueaderos_get,
  getParqueaderoById_get,
  createParqueadero_post,
  updateParqueadero_put,
  deleteParqueadero_delete,
  getParqueaderoStats_get
} from "../models/parqueadero.model";

// 🔹 GET ALL
export async function getParqueaderos(req: Request, res: Response): Promise<Response> {
  const data = await getParqueaderos_get();
  return res.status(HttpStatusCode.Ok).json({ data });
}

// 🔹 GET BY ID
export async function getParqueaderoById(req: Request<{ id: string }>, res: Response): Promise<Response> {
  const { id } = req.params;

  const data = await getParqueaderoById_get(Number(id));

  if (!data) {
    return res.status(HttpStatusCode.NotFound).json({ message: "No encontrado" });
  }

  return res.status(HttpStatusCode.Ok).json({ data });
}

// 🔹 CREATE
export async function createParqueadero(req: Request, res: Response): Promise<Response> {
  try {
    const { nombre, capacidadMaxima, requierePago } = req.body;

    const success = await createParqueadero_post({
      nombre,
      capacidadMaxima,
      requierePago,
    });

    if (!success) {
      return res.status(HttpStatusCode.BadRequest).json({ message: "No se pudo crear" });
    }

    return res.status(HttpStatusCode.Ok).json({ message: "Parqueadero creado correctamente" });

  } catch (error) {
    console.error(error);
    return res.status(HttpStatusCode.InternalServerError).json({ message: "Error servidor" });
  }
}

// 🔹 UPDATE
export async function updateParqueadero(req: Request<{ id: string }>, res: Response): Promise<Response> {
  try {
    const { id } = req.params;
    const { nombre, capacidadMaxima, requierePago } = req.body;

    const success = await updateParqueadero_put({
      idParqueadero: Number(id),
      nombre,
      capacidadMaxima,
      requierePago,
    });

    if (!success) {
      return res.status(HttpStatusCode.BadRequest).json({ message: "No se pudo actualizar" });
    }

    return res.status(HttpStatusCode.Ok).json({ message: "Actualizado correctamente" });

  } catch (error) {
    console.error(error);
    return res.status(HttpStatusCode.InternalServerError).json({ message: "Error servidor" });
  }
}

// 🔹 DELETE
export async function deleteParqueadero(req: Request<{ id: string }>, res: Response): Promise<Response> {
  const { id } = req.params;

  const success = await deleteParqueadero_delete(Number(id));

  if (!success) {
    return res.status(HttpStatusCode.BadRequest).json({ message: "No se pudo eliminar" });
  }

  return res.status(HttpStatusCode.Ok).json({ message: "Eliminado correctamente" });
}

export async function getParqueaderoStats(req: Request<{ id: string }>, res: Response) {
  try {
    const { id } = req.params;

    const data = await getParqueaderoStats_get(Number(id));

    if (!data) {
      return res.status(404).json({ message: "Parqueadero no encontrado" });
    }

    return res.status(200).json({ data });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error servidor" });
  }
}