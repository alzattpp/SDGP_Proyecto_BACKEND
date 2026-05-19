import MySQLConnector from "../db/connection";
import { PagoInterface } from "../interfaces/intrefaces";

const db = new MySQLConnector();

// 🔹 GET ALL
export async function getPagos_get(): Promise<PagoInterface[]> {
  try {

    await db.connect();

    const sql = `SELECT * FROM Pago`;

    const response: any = await db.query(sql);

    db.close();

    return response;

  } catch (error) {

    console.error(error);

    return [];
  }
}


// 🔹 GET BY ID
export async function getPagoById_get(
  id:number
): Promise<PagoInterface | null>{

  try{

    await db.connect();

    const sql=`
      SELECT *
      FROM Pago
      WHERE idPago = ?
    `;

    const response:any=
    await db.query(
      sql,
      [id]
    );

    db.close();

    return response.length > 0
    ? response[0]
    : null;

  }catch(error){

    console.error(error);

    return null;

  }

}


// 🔹 GET PAGOS POR USUARIO
export async function getPagosByUsuario_get(
  idUsuario:number
): Promise<PagoInterface[]>{

  try{

    await db.connect();

    const sql=`
      SELECT *
      FROM Pago
      WHERE idUsuario=?
    `;

    const response:any=
    await db.query(
      sql,
      [idUsuario]
    );

    db.close();

    return response;

  }catch(error){

    console.error(error);

    return [];

  }

}


// 🔹 CREATE
export async function createPago_post(
  data:PagoInterface
): Promise<boolean>{

  try{

    await db.connect();

    const sql=`
      INSERT INTO Pago
      (
        idIngreso,
        idUsuario,
        idMedioPago,
        fecha,
        monto,
        estado
      )
      VALUES(?,?,?,?,?,?)
    `;

    const response:any=
    await db.query(
      sql,
      [
        data.idIngreso || null,
        data.idUsuario,
        data.idMedioPago,
        data.fecha,
        data.monto,
        data.estado || "PENDIENTE"
      ]
    );

    db.close();

    return response.affectedRows > 0;

  }catch(error){

    console.error(error);

    return false;

  }

}


// 🔹 UPDATE
export async function updatePago_put(
  data:PagoInterface
): Promise<boolean>{

  try{

    await db.connect();

    const sql=`
      UPDATE Pago
      SET
      idIngreso=?,
      idMedioPago=?,
      monto=?,
      estado=?
      WHERE idPago=?
    `;

    const response:any=
    await db.query(
      sql,
      [
        data.idIngreso,
        data.idMedioPago,
        data.monto,
        data.estado,
        data.idPago
      ]
    );

    db.close();

    return response.affectedRows > 0;

  }catch(error){

    console.error(error);

    return false;

  }

}


// 🔹 DELETE
export async function deletePago_delete(
  id:number
): Promise<boolean>{

  try{

    await db.connect();

    const sql=`
      DELETE
      FROM Pago
      WHERE idPago=?
    `;

    const response:any=
    await db.query(
      sql,
      [id]
    );

    db.close();

    return response.affectedRows > 0;

  }catch(error){

    console.error(error);

    return false;

  }

}