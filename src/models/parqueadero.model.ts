import MySQLConnector from "../db/connection";
import { ParqueaderoInterface } from "../interfaces/intrefaces";

// 🔹 GET ALL
export async function getParqueaderos_get(): Promise<ParqueaderoInterface[]> {
  const db = new MySQLConnector();
  try {
    const sql = `SELECT * FROM Parqueadero`;
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
export async function getParqueaderoById_get(id: number): Promise<ParqueaderoInterface | null> {
  const db = new MySQLConnector();
  try {
    const sql = `SELECT * FROM Parqueadero WHERE idParqueadero = ?`;
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
export async function createParqueadero_post(data: ParqueaderoInterface): Promise<boolean> {
  const db = new MySQLConnector();
  try {
    const sql = `
      INSERT INTO Parqueadero (nombre, capacidadMaxima, requierePago)
      VALUES (?, ?, ?)
    `;

    const response: any = await db.query(sql, [
      data.nombre,
      data.capacidadMaxima,
      data.requierePago,
    ]);

    return response.affectedRows > 0;
  } catch (error) {
    console.error(error);
    return false;
  } finally {
    await db.close();
  }
}

// 🔹 UPDATE
export async function updateParqueadero_put(data: ParqueaderoInterface): Promise<boolean> {
  const db = new MySQLConnector();
  try {
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

    return response.affectedRows > 0;
  } catch (error) {
    console.error(error);
    return false;
  } finally {
    await db.close();
  }
}

// 🔹 DELETE
export async function deleteParqueadero_delete(id: number): Promise<boolean> {
  const db = new MySQLConnector();
  try {
    const sql = `DELETE FROM Parqueadero WHERE idParqueadero = ?`;
    const response: any = await db.query(sql, [id]);
    return response.affectedRows > 0;
  } catch (error) {
    console.error(error);
    return false;
  } finally {
    await db.close();
  }
}

export async function getParqueaderoStats_get(idParqueadero: number) {
  const db = new MySQLConnector();
  try {
    const parqueadero: any = await db.query(
      "SELECT capacidadMaxima FROM Parqueadero WHERE idParqueadero = ?",
      [idParqueadero]
    );

    if (parqueadero.length === 0) {
      return null;
    }

    const capacidad = parqueadero[0].capacidadMaxima;

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
  } finally {
    await db.close();
  }
}
