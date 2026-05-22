import { Request, Response } from "express";
import { HttpStatusCode } from "axios";

import {

    getOcupacionReporte_get,
    getIngresosReporte_get,
    getPagosReporte_get

}
from "../models/reporte.model";



// 🔹 REPORTE OCUPACION
export async function getOcupacionReporte(
    req: Request,
    res: Response
): Promise<Response>{

    try{

        const { idParqueadero }=
        req.params;

        const data=
        await getOcupacionReporte_get(

            idParqueadero
            ? Number(idParqueadero)
            : undefined

        );

        return res.status(
            HttpStatusCode.Ok
        ).json({
            data
        });

    }
    catch(error){

        console.error(error);

        return res.status(
            HttpStatusCode.InternalServerError
        ).json({
            message:
            "Error generando reporte"
        });

    }

}



// 🔹 REPORTE INGRESOS
export async function getIngresosReporte(
    req: Request,
    res: Response
): Promise<Response>{

    try{

        const { idParqueadero }=
        req.params;

        const data=
        await getIngresosReporte_get(

            idParqueadero
            ? Number(idParqueadero)
            : undefined

        );

        return res.status(
            HttpStatusCode.Ok
        ).json({
            data
        });

    }
    catch(error){

        console.error(error);

        return res.status(
            HttpStatusCode.InternalServerError
        ).json({
            message:
            "Error generando reporte"
        });

    }

}



// 🔹 REPORTE PAGOS
export async function getPagosReporte(
    req: Request,
    res: Response
): Promise<Response>{

    try{

        const data=
        await getPagosReporte_get();

        return res.status(
            HttpStatusCode.Ok
        ).json({
            data
        });

    }
    catch(error){

        console.error(error);

        return res.status(
            HttpStatusCode.InternalServerError
        ).json({
            message:
            "Error generando reporte"
        });

    }

}