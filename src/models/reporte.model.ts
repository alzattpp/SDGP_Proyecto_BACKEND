import MySQLConnector from "../db/connection";


// 🔹 REPORTE 1: ocupacion actual
export async function getOcupacionReporte_get(
  idParqueadero?: number
): Promise<any[]> {

  const db = new MySQLConnector();

  try {

    let sql = `
      SELECT
        p.idParqueadero,
        p.nombreParqueadero,

        COUNT(
          CASE
            WHEN i.fechaSalida IS NULL
            THEN i.idIngreso
          END
        ) AS ocupados,

        (
          p.totalCupos -
          COUNT(
            CASE
              WHEN i.fechaSalida IS NULL
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

      params.push(idParqueadero);
    }

    sql+=`
      GROUP BY
      p.idParqueadero,
      p.nombreParqueadero
    `;

    const response:any=
    await db.query(
      sql,
      params
    );

    return response;

  } catch(error){

    console.error(error);
    return [];

  } finally{

    await db.close();

  }

}



// 🔹 REPORTE 2: ingresos vehiculares
export async function getIngresosReporte_get(
  idParqueadero?:number
):Promise<any[]>{

  const db=new MySQLConnector();

  try{

    let sql=`
      SELECT

      i.idIngreso,
      v.placa,
      i.fechaEntrada,
      i.fechaSalida,
      p.nombreParqueadero

      FROM Ingreso i

      INNER JOIN Vehiculo v
      ON i.idVehiculo=v.idVehiculo

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
      i.fechaEntrada DESC
    `;

    const response:any=
    await db.query(
      sql,
      params
    );

    return response;

  }catch(error){

    console.error(error);
    return [];

  }finally{

    await db.close();

  }

}



// 🔹 REPORTE 3: pagos realizados
export async function getPagosReporte_get():Promise<any>{

  const db=new MySQLConnector();

  try{

    const sql=`

    SELECT

      COUNT(*) totalPagos,

      SUM(valorTotal) totalRecaudado,

      AVG(valorTotal) promedioPago,

      MAX(valorTotal) pagoMayor,

      MIN(valorTotal) pagoMenor

    FROM Pago
    `;

    const response:any=
    await db.query(sql);

    return response[0];

  }catch(error){

    console.error(error);

    return null;

  }finally{

    await db.close();

  }

}