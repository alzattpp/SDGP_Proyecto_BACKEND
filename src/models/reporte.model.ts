import MySQLConnector from "../db/connection";

import {
    ReporteOcupacionInterface,
    ReporteIngresosInterface,
    ReportePagosInterface
}
from "../interfaces/intrefaces";



// 🔹 REPORTE OCUPACION
export async function getOcupacionReporte_get(
    idParqueadero?: number
): Promise<ReporteOcupacionInterface[]> {

    const db = new MySQLConnector();

    try {

        let sql = `

        SELECT

            p.idParqueadero,
            p.nombre,

            COUNT(
                CASE
                    WHEN i.estado='activo'
                    THEN i.idIngreso
                END
            ) AS ocupados,

            (
                p.capacidadMaxima -

                COUNT(
                    CASE
                        WHEN i.estado='activo'
                        THEN i.idIngreso
                    END
                )

            ) AS disponibles

        FROM Parqueadero p

        LEFT JOIN Ingreso i
        ON p.idParqueadero=i.idParqueadero

        `;

        const params:any[]=[];

        if(idParqueadero){

            sql+=`
            WHERE p.idParqueadero=?
            `;

            params.push(
                idParqueadero
            );

        }

        sql+=`

        GROUP BY
        p.idParqueadero,
        p.nombre

        `;

        const response:any=
        await db.query(
            sql,
            params
        );

        return response;

    }
    catch(error){

        console.error(error);

        return [];

    }
    finally{

        await db.close();

    }

}



// 🔹 REPORTE INGRESOS
export async function getIngresosReporte_get(
    idParqueadero?:number
):Promise<ReporteIngresosInterface[]>{

    const db=new MySQLConnector();

    try{

        let sql=`

        SELECT

            i.idIngreso,
            i.placa,
            i.horaIngreso,
            i.horaSalida,
            i.estado,
            p.nombre

        FROM Ingreso i

        INNER JOIN Parqueadero p
        ON i.idParqueadero=p.idParqueadero

        `;

        const params:any[]=[];

        if(idParqueadero){

            sql+=`
            WHERE p.idParqueadero=?
            `;

            params.push(
                idParqueadero
            );

        }

        sql+=`

        ORDER BY
        i.horaIngreso DESC

        `;

        const response:any=
        await db.query(
            sql,
            params
        );

        return response;

    }
    catch(error){

        console.error(error);

        return [];

    }
    finally{

        await db.close();

    }

}



// 🔹 REPORTE PAGOS
export async function getPagosReporte_get(
):Promise<ReportePagosInterface | null>{

    const db=new MySQLConnector();

    try{

        const sql=`

        SELECT

            COUNT(*) AS totalPagos,

            SUM(monto) AS totalRecaudado,

            AVG(monto) AS promedioPago,

            MAX(monto) AS pagoMayor,

            MIN(monto) AS pagoMenor

        FROM Pago

        `;

        const response:any=
        await db.query(sql);

        return response[0];

    }
    catch(error){

        console.error(error);

        return null;

    }
    finally{

        await db.close();

    }

}