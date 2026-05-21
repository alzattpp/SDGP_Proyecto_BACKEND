import MySQLConnector from "../db/connection";
import { IngresoInterface } from "../interfaces/intrefaces";

// 🔹 GET ALL
export async function getIngresos_get(): Promise<IngresoInterface[]> {
  const db = new MySQLConnector();
  try {
    const sql = `SELECT * FROM Ingreso`;
    const response: any = await db.query(sql);
    return response;
  } catch (error) {
    console.error(error);
    return [];
  } finally {
    await db.close();
  }
}

// 🔹 GET BY ID
export async function getIngresoById_get(id: number): Promise<IngresoInterface | null> {
  const db = new MySQLConnector();
  try {
    const sql = `SELECT * FROM Ingreso WHERE idIngreso = ?`;
    const response: any = await db.query(sql, [id]);
    return response.length > 0 ? response[0] : null;
  } catch (error) {
    console.error(error);
    return null;
  } finally {
    await db.close();
  }
}

// 🔹 CREATE
export async function createIngreso_post(data: IngresoInterface): Promise<boolean> {
  const db = new MySQLConnector();
  try {
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

    return response.affectedRows > 0;
  } catch (error) {
    console.error(error);
    return false;
  } finally {
    await db.close();
  }
}

// 🔹 UPDATE (salida o estado)
export async function updateIngreso_put(data: IngresoInterface): Promise<boolean> {
  const db = new MySQLConnector();
  try {
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

    return response.affectedRows > 0;
  } catch (error) {
    console.error(error);
    return false;
  } finally {
    await db.close();
  }
}

// 🔹 DELETE
export async function deleteIngreso_delete(id: number): Promise<boolean> {
  const db = new MySQLConnector();
  try {
    const sql = `DELETE FROM Ingreso WHERE idIngreso = ?`;
    const response: any = await db.query(sql, [id]);
    return response.affectedRows > 0;
  } catch (error) {
    console.error(error);
    return false;
  } finally {
    await db.close();
  }
}
