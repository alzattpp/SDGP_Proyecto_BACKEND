import { Request, Response } from "express";
import { HttpStatusCode } from "axios";

import {
  getPagos_get,
  getPagoById_get,
  getPagosByUsuario_get,
  createPago_post,
  updatePago_put,
  deletePago_delete
} from "../models/pago.model";


// 🔹 GET ALL
export async function getPagos(
  req: Request,
  res: Response
): Promise<Response> {

  const data = await getPagos_get();

  return res.status(
    HttpStatusCode.Ok
  ).json({
    data
  });

}


// 🔹 GET BY ID
export async function getPagoById(
  req: Request<{id:string}>,
  res: Response
): Promise<Response>{

  const { id } = req.params;

  const data =
  await getPagoById_get(
    Number(id)
  );

  if(!data){

    return res.status(
      HttpStatusCode.NotFound
    ).json({
      message:"No encontrado"
    });

  }

  return res.status(
    HttpStatusCode.Ok
  ).json({
    data
  });

}


// 🔹 GET PAGOS POR USUARIO
export async function getPagosByUsuario(
  req: Request<{idUsuario:string}>,
  res: Response
): Promise<Response>{

  const { idUsuario } = req.params;

  const data =
  await getPagosByUsuario_get(
    Number(idUsuario)
  );

  return res.status(
    HttpStatusCode.Ok
  ).json({
    data
  });

}


// 🔹 CREATE
export async function createPago(
  req: Request,
  res: Response
): Promise<Response>{

  try{

    const {
      idIngreso,
      idUsuario,
      idMedioPago,
      monto
    } = req.body;

    // 🔥 fecha actual compatible con MySQL
    const now =
    new Date()
    .toISOString()
    .slice(0,19)
    .replace("T"," ");

    const success =
    await createPago_post({

      idIngreso,
      idUsuario,
      idMedioPago,
      fecha:now,
      monto,
      estado:"PENDIENTE"

    });

    if(!success){

      return res.status(
        HttpStatusCode.BadRequest
      ).json({
        message:"No se pudo registrar"
      });

    }

    return res.status(
      HttpStatusCode.Ok
    ).json({
      message:"Pago registrado correctamente"
    });

  }catch(error){

    console.error(error);

    return res.status(
      HttpStatusCode.InternalServerError
    ).json({
      message:"Error servidor"
    });

  }

}


// 🔹 UPDATE
export async function updatePago(
  req: Request<{id:string}>,
  res: Response
): Promise<Response>{

  try{

    const { id } = req.params;

    const {
      idIngreso,
      idUsuario,
      idMedioPago,
      fecha,
      monto,
      estado
    } = req.body;

    const success =
    await updatePago_put({

      idPago:Number(id),
      idIngreso,
      idUsuario,
      idMedioPago,
      fecha,
      monto,
      estado

    });

    if(!success){

      return res.status(
        HttpStatusCode.BadRequest
      ).json({
        message:"No se pudo actualizar"
      });

    }

    return res.status(
      HttpStatusCode.Ok
    ).json({
      message:"Actualizado correctamente"
    });

  }catch(error){

    console.error(error);

    return res.status(
      HttpStatusCode.InternalServerError
    ).json({
      message:"Error servidor"
    });

  }

}


// 🔹 DELETE
export async function deletePago(
  req: Request<{id:string}>,
  res: Response
): Promise<Response>{

  const { id } = req.params;

  const success =
  await deletePago_delete(
    Number(id)
  );

  if(!success){

    return res.status(
      HttpStatusCode.BadRequest
    ).json({
      message:"No se pudo eliminar"
    });

  }

  return res.status(
    HttpStatusCode.Ok
  ).json({
    message:"Eliminado correctamente"
  });

}