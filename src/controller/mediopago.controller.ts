import { Request, Response } from "express";
import { HttpStatusCode } from "axios";

import {
  getMediosPago_get,
  getMedioPagoById_get,
  createMedioPago_post,
  updateMedioPago_put,
  deleteMedioPago_delete,
  getMedioPagoByUsuario_get
} from "../models/mediopago.model";

// 🔹 GET ALL
export async function getMediosPago(
  req: Request,
  res: Response
): Promise<Response> {

  const data = await getMediosPago_get();

  return res.status(HttpStatusCode.Ok).json({ data });
}

// 🔹 GET BY ID
export async function getMedioPagoById(
  req: Request<{id:string}>,
  res: Response
): Promise<Response> {

  const { id } = req.params;

  const data = await getMedioPagoById_get(Number(id));

  if (!data) {
    return res.status(HttpStatusCode.NotFound).json({
      message: "No encontrado"
    });
  }

  return res.status(HttpStatusCode.Ok).json({ data });
}

// 🔹 CREATE
export async function createMedioPago(
  req: Request,
  res: Response
): Promise<Response> {

  try {

    const {
      idUsuario,
      tipo,
      numeroReferencia,
      cvv
    } = req.body;

    const success = await createMedioPago_post({
      idUsuario,
      tipo,
      numeroReferencia,
      cvv,
      estado: "ACTIVO"
    });

    if (!success) {
      return res.status(HttpStatusCode.BadRequest).json({
        message: "No se pudo registrar"
      });
    }

    return res.status(HttpStatusCode.Ok).json({
      message: "Medio de pago registrado correctamente"
    });

  } catch(error){

    console.error(error);

    return res.status(HttpStatusCode.InternalServerError).json({
      message:"Error servidor"
    });
  }
}

// 🔹 UPDATE
export async function updateMedioPago(
  req: Request<{id:string}>,
  res: Response
): Promise<Response> {

  try{

    const { id } = req.params;

    const {
      tipo,
      numeroReferencia,
      cvv,
      estado
    } = req.body;

    const success = await updateMedioPago_put({
      idMedioPago:Number(id),
      idUsuario:0,
      tipo,
      numeroReferencia,
      cvv,
      estado
    });

    if(!success){
      return res.status(HttpStatusCode.BadRequest).json({
        message:"No se pudo actualizar"
      });
    }

    return res.status(HttpStatusCode.Ok).json({
      message:"Actualizado correctamente"
    });

  }catch(error){

    console.error(error);

    return res.status(HttpStatusCode.InternalServerError).json({
      message:"Error servidor"
    });
  }
}

// 🔹 DELETE
export async function deleteMedioPago(
  req: Request<{id:string}>,
  res: Response
): Promise<Response>{

  const { id } = req.params;

  const success = await deleteMedioPago_delete(Number(id));

  if(!success){
    return res.status(HttpStatusCode.BadRequest).json({
      message:"No se pudo eliminar"
    });
  }

  return res.status(HttpStatusCode.Ok).json({
    message:"Eliminado correctamente"
  });
}
// 🔹 GET medios de pago por usuario
export async function getMedioPagoByUsuario(
  req: Request<{idUsuario:string}>,
  res: Response
): Promise<Response>{

  const { idUsuario } = req.params;

  const data = await getMedioPagoByUsuario_get(
    Number(idUsuario)
  );

  return res.status(HttpStatusCode.Ok).json({
    data
  });
}