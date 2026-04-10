import MySQLConnector from "../db/connection";
import { ParqueaderoInterface } from "../interfaces/intrefaces";

const db = new MySQLConnector();

// 🔹 GET ALL
export async function getParqueaderos_get(): Promise<ParqueaderoInterface[]> {
  try {
    await db.connect();

    const sql = `SELECT * FROM Parqueadero`;
    const response: any = await db.query(sql);

    db.close();
    return response;

  } catch (error) {
    console.error(error);
    return [];
  }
}

// 🔹 GET BY ID
export async function getParqueaderoById_get(id: number): Promise<ParqueaderoInterface | null> {
  try {
    await db.connect();

    const sql = `SELECT * FROM Parqueadero WHERE idParqueadero = ?`;
    const response: any = await db.query(sql, [id]);

    db.close();
    return response.length > 0 ? response[0] : null;

  } catch (error) {
    console.error(error);
    return null;
  }
}

// 🔹 CREATE
export async function createParqueadero_post(data: ParqueaderoInterface): Promise<boolean> {
  try {
    await db.connect();

    const sql = `
      INSERT INTO Parqueadero (nombre, capacidadMaxima, requierePago)
      VALUES (?, ?, ?)
    `;

    const response: any = await db.query(sql, [
      data.nombre,
      data.capacidadMaxima,
      data.requierePago,
    ]);

    db.close();
    return response.affectedRows > 0;

  } catch (error) {
    console.error(error);
    return false;
  }
}

// 🔹 UPDATE
export async function updateParqueadero_put(data: ParqueaderoInterface): Promise<boolean> {
  try {
    await db.connect();

    const sql = `
      UPDATE Parqueadero
      SET nombre = ?, capacidadMaxima = ?, requierePago = ?
      WHERE idParqueadero = ?
    `;

    const response: any = await db.query(sql, [
      data.nombre,
      data.capacidadMaxima,
      data.requierePago,
      data.idParqueadero,
    ]);

    db.close();
    return response.affectedRows > 0;

  } catch (error) {
    console.error(error);
    return false;
  }
}

// 🔹 DELETE
export async function deleteParqueadero_delete(id: number): Promise<boolean> {
  try {
    await db.connect();

    const sql = `DELETE FROM Parqueadero WHERE idParqueadero = ?`;
    const response: any = await db.query(sql, [id]);

    db.close();
    return response.affectedRows > 0;

  } catch (error) {
    console.error(error);
    return false;
  }
}

export async function getParqueaderoStats_get(idParqueadero: number) {
  try {
    await db.connect();

    // 🔹 Obtener capacidad
    const parqueadero: any = await db.query(
      "SELECT capacidadMaxima FROM Parqueadero WHERE idParqueadero = ?",
      [idParqueadero]
    );

    if (parqueadero.length === 0) {
      db.close();
      return null;
    }

    const capacidad = parqueadero[0].capacidadMaxima;

    // 🔹 Contar ocupados
    const ocupadosResult: any = await db.query(
      `SELECT COUNT(*) as ocupados 
       FROM Ingreso 
       WHERE idParqueadero = ? AND estado = 'EN_PARQUEADERO'`,
      [idParqueadero]
    );

    const ocupados = ocupadosResult[0].ocupados;

    const disponibles = capacidad - ocupados;

    const porcentajeOcupacion = Math.round((ocupados / capacidad) * 100);
    const porcentajeDisponibilidad = 100 - porcentajeOcupacion;

    db.close();

    return {
      capacidadTotal: capacidad,
      ocupados,
      disponibles,
      porcentajeOcupacion,
      porcentajeDisponibilidad,
    };

  } catch (error) {
    console.error(error);
    return null;
  }
}