import { Request, Response } from "express";
import { HttpStatusCode } from "axios";
import {
  getVehiculos_get,
  getVehiculoByPlaca_get,
  createVehiculo_post,
  updateVehiculo_put,
  deleteVehiculo_delete
} from "../models/vehiculo.model";

// 🔹 GET ALL
export async function getVehiculos(req: Request, res: Response): Promise<Response> {
  const data = await getVehiculos_get();
  return res.status(HttpStatusCode.Ok).json({ data });
}

// 🔹 GET BY PLACA
export async function getVehiculoByPlaca(req: Request<{ placa: string }>, res: Response): Promise<Response> {
  const { placa } = req.params;

  const data = await getVehiculoByPlaca_get(placa);

  if (!data) {
    return res.status(HttpStatusCode.NotFound).json({ message: "Vehículo no encontrado" });
  }

  return res.status(HttpStatusCode.Ok).json({ data });
}

// 🔹 CREATE
export async function createVehiculo(req: Request, res: Response): Promise<Response> {
  try {
    const { placa, idUsuario, marca } = req.body;

    const success = await createVehiculo_post({ placa, idUsuario, marca });

    if (!success) {
      return res.status(HttpStatusCode.BadRequest).json({ message: "No se pudo crear" });
    }

    return res.status(HttpStatusCode.Ok).json({ message: "Vehículo creado correctamente" });

  } catch (error) {
    return res.status(HttpStatusCode.InternalServerError).json({ message: "Error servidor" });
  }
}

// 🔹 UPDATE
export async function updateVehiculo(req: Request<{ placa: string }>, res: Response): Promise<Response> {
  try {
    const { placa } = req.params;
    const { idUsuario, marca } = req.body;

    const success = await updateVehiculo_put({
      placa,
      idUsuario,
      marca,
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
export async function deleteVehiculo(req: Request<{ placa: string }>, res: Response): Promise<Response> {
  const { placa } = req.params;

  const success = await deleteVehiculo_delete(placa);

  if (!success) {
    return res.status(HttpStatusCode.BadRequest).json({ message: "No se pudo eliminar" });
  }

  return res.status(HttpStatusCode.Ok).json({ message: "Eliminado correctamente" });
}