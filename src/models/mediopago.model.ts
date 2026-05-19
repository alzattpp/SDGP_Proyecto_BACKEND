import MySQLConnector from "../db/connection";
import { MedioPagoInterface } from "../interfaces/intrefaces";

const db = new MySQLConnector();

// 🔹 GET ALL
export async function getMediosPago_get(): Promise<MedioPagoInterface[]> {
  try {
    await db.connect();

    const sql = `SELECT * FROM MedioPago`;
    const response: any = await db.query(sql);

    db.close();
    return response;

  } catch (error) {
    console.error(error);
    return [];
  }
}

// 🔹 GET BY ID
export async function getMedioPagoById_get(id: number): Promise<MedioPagoInterface | null> {
  try {
    await db.connect();

    const sql = `SELECT * FROM MedioPago WHERE idMedioPago = ?`;
    const response: any = await db.query(sql, [id]);

    db.close();

    return response.length > 0 ? response[0] : null;

  } catch (error) {
    console.error(error);
    return null;
  }
}
// 🔹 GET BY ID USUARIO
export async function getMedioPagoByUsuario_get(
  idUsuario: number
): Promise<MedioPagoInterface[]> {

  try {

    await db.connect();

    const sql = `
      SELECT *
      FROM MedioPago
      WHERE idUsuario = ?
    `;

    const response: any = await db.query(sql, [idUsuario]);

    db.close();

    return response;

  } catch (error) {

    console.error(error);

    return [];
  }
}

// 🔹 CREATE
export async function createMedioPago_post(data: MedioPagoInterface): Promise<boolean> {
  try {
    await db.connect();

    const sql = `
      INSERT INTO MedioPago
      (idUsuario, tipo, numeroReferencia, cvv, estado)
      VALUES (?, ?, ?, ?, ?)
    `;

    const response: any = await db.query(sql, [
      data.idUsuario,
      data.tipo,
      data.numeroReferencia,
      data.cvv || null,
      data.estado || "ACTIVO"
    ]);

    db.close();

    return response.affectedRows > 0;

  } catch (error) {
    console.error(error);
    return false;
  }
}

// 🔹 UPDATE
export async function updateMedioPago_put(data: MedioPagoInterface): Promise<boolean> {
  try {
    await db.connect();

    const sql = `
      UPDATE MedioPago
      SET tipo = ?,
          numeroReferencia = ?,
          cvv = ?,
          estado = ?
      WHERE idMedioPago = ?
    `;

    const response: any = await db.query(sql, [
      data.tipo,
      data.numeroReferencia,
      data.cvv,
      data.estado,
      data.idMedioPago
    ]);

    db.close();

    return response.affectedRows > 0;

  } catch (error) {
    console.error(error);
    return false;
  }
}

// 🔹 DELETE
export async function deleteMedioPago_delete(id: number): Promise<boolean> {
  try {
    await db.connect();

    const sql = `DELETE FROM MedioPago WHERE idMedioPago = ?`;

    const response: any = await db.query(sql, [id]);

    db.close();

    return response.affectedRows > 0;

  } catch (error) {
    console.error(error);
    return false;
  }
}