import { Request, Response } from "express";
import { HttpStatusCode } from "axios";
import {
  getIngresos_get,
  getIngresoById_get,
  createIngreso_post,
  updateIngreso_put,
  deleteIngreso_delete
} from "../models/ingreso.model";

// 🔹 GET ALL
export async function getIngresos(req: Request, res: Response): Promise<Response> {
  const data = await getIngresos_get();
  return res.status(HttpStatusCode.Ok).json({ data });
}

// 🔹 GET BY ID
export async function getIngresoById(req: Request<{ id: string }>, res: Response): Promise<Response> {
  const { id } = req.params;

  const data = await getIngresoById_get(Number(id));

  if (!data) {
    return res.status(HttpStatusCode.NotFound).json({ message: "No encontrado" });
  }

  return res.status(HttpStatusCode.Ok).json({ data });
}

export async function createIngreso(req: Request, res: Response): Promise<Response> {
  try {
    const { placa, idParqueadero } = req.body;

    // 🔥 Formato correcto para MySQL
    const now = new Date().toISOString().slice(0, 19).replace("T", " ");

    const success = await createIngreso_post({
      placa,
      idParqueadero,
      horaIngreso: now,
      estado: "EN_PARQUEADERO", // 🔥 SIEMPRE este estado
    });

    if (!success) {
      return res.status(HttpStatusCode.BadRequest).json({
        message: "No se pudo registrar ingreso"
      });
    }

    return res.status(HttpStatusCode.Ok).json({
      message: "Ingreso registrado correctamente"
    });

  } catch (error) {
    console.error("Error en createIngreso:", error);
    return res.status(HttpStatusCode.InternalServerError).json({
      message: "Error servidor"
    });
  }
}

// 🔹 UPDATE (salida)
export async function updateIngreso(req: Request<{ id: string }>, res: Response): Promise<Response> {
  try {
    const { id } = req.params;

    // 🔥 Formato correcto para MySQL
    const now = new Date().toISOString().slice(0, 19).replace("T", " ");

    const success = await updateIngreso_put({
      idIngreso: Number(id),
      horaSalida: now,
      estado: "FINALIZADO", // 🔥 cambia estado al salir
      placa: "",
      idParqueadero: 0,
      horaIngreso: "",
    });

    if (!success) {
      return res.status(HttpStatusCode.BadRequest).json({
        message: "No se pudo registrar salida"
      });
    }

    return res.status(HttpStatusCode.Ok).json({
      message: "Salida registrada correctamente"
    });

  } catch (error) {
    console.error("Error en updateIngreso:", error);
    return res.status(HttpStatusCode.InternalServerError).json({
      message: "Error servidor"
    });
  }
}

// 🔹 DELETE
export async function deleteIngreso(req: Request<{ id: string }>, res: Response): Promise<Response> {
  const { id } = req.params;

  const success = await deleteIngreso_delete(Number(id));

  if (!success) {
    return res.status(HttpStatusCode.BadRequest).json({ message: "No se pudo eliminar" });
  }

  return res.status(HttpStatusCode.Ok).json({ message: "Eliminado correctamente" });
}