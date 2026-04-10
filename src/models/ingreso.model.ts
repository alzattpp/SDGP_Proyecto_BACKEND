import MySQLConnector from "../db/connection";
import { IngresoInterface } from "../interfaces/intrefaces";

const db = new MySQLConnector();

// 🔹 GET ALL
export async function getIngresos_get(): Promise<IngresoInterface[]> {
  try {
    await db.connect();

    const sql = `SELECT * FROM Ingreso`;
    const response: any = await db.query(sql);

    db.close();
    return response;

  } catch (error) {
    console.error(error);
    return [];
  }
}

// 🔹 GET BY ID
export async function getIngresoById_get(id: number): Promise<IngresoInterface | null> {
  try {
    await db.connect();

    const sql = `SELECT * FROM Ingreso WHERE idIngreso = ?`;
    const response: any = await db.query(sql, [id]);

    db.close();
    return response.length > 0 ? response[0] : null;

  } catch (error) {
    console.error(error);
    return null;
  }
}

// 🔹 CREATE
export async function createIngreso_post(data: IngresoInterface): Promise<boolean> {
  try {
    await db.connect();

    const sql = `
      INSERT INTO Ingreso (placa, idParqueadero, horaIngreso, estado)
      VALUES (?, ?, ?, ?)
    `;

    const response: any = await db.query(sql, [
      data.placa,
      data.idParqueadero,
      data.horaIngreso,
      data.estado,
    ]);

    db.close();
    return response.affectedRows > 0;

  } catch (error) {
    console.error(error);
    return false;
  }
}

// 🔹 UPDATE (salida o estado)
export async function updateIngreso_put(data: IngresoInterface): Promise<boolean> {
  try {
    await db.connect();

    const sql = `
      UPDATE Ingreso
      SET horaSalida = ?, estado = ?
      WHERE idIngreso = ?
    `;

    const response: any = await db.query(sql, [
      data.horaSalida,
      data.estado,
      data.idIngreso,
    ]);

    db.close();
    return response.affectedRows > 0;

  } catch (error) {
    console.error(error);
    return false;
  }
}

// 🔹 DELETE
export async function deleteIngreso_delete(id: number): Promise<boolean> {
  try {
    await db.connect();

    const sql = `DELETE FROM Ingreso WHERE idIngreso = ?`;
    const response: any = await db.query(sql, [id]);

    db.close();
    return response.affectedRows > 0;

  } catch (error) {
    console.error(error);
    return false;
  }
}