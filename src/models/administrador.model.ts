import MySQLConnector from "../db/connection";
import { AdministradorInterface } from "../interfaces/intrefaces";

const db = new MySQLConnector();

// 🔹 GET ALL
export async function getAdministradores_get(): Promise<any[]> {
  try {
    await db.connect();

    const sql = `
      SELECT a.idAdmin, u.idUsuario, u.nombreCompleto, u.correo, u.documento
      FROM Administrador a
      INNER JOIN Usuario u ON a.idUsuario = u.idUsuario
    `;

    const response: any = await db.query(sql);
    db.close();
    return response;

  } catch (error) {
    console.error(error);
    return [];
  }
}

// 🔹 GET BY ID
export async function getAdministradorById_get(idAdmin: number): Promise<any | null> {
  try {
    await db.connect();

    const sql = `
      SELECT a.idAdmin, u.idUsuario, u.nombreCompleto, u.correo, u.documento
      FROM Administrador a
      INNER JOIN Usuario u ON a.idUsuario = u.idUsuario
      WHERE a.idAdmin = ?
    `;

    const response: any = await db.query(sql, [idAdmin]);
    db.close();

    return response.length > 0 ? response[0] : null;

  } catch (error) {
    console.error(error);
    return null;
  }
}

// 🔹 CREATE (TRANSACCIÓN 🔥)
export async function createAdministrador_post(data: AdministradorInterface): Promise<boolean> {
  try {
    await db.connect();
    await db.beginTransaction();

    // 1. usuario
    const sqlUsuario = `
      INSERT INTO Usuario (nombreCompleto, correo, contrasena, documento)
      VALUES (?, ?, ?, ?)
    `;

    const resultUsuario: any = await db.query(sqlUsuario, [
      data.nombreCompleto,
      data.correo,
      data.contrasena,
      data.documento,
    ]);

    const idUsuario = resultUsuario.insertId;

    // 2. admin
    const sqlAdmin = `
      INSERT INTO Administrador (idUsuario)
      VALUES (?)
    `;

    const resultAdmin: any = await db.query(sqlAdmin, [idUsuario]);

    await db.commit();
    db.close();

    return resultAdmin.affectedRows > 0;

  } catch (error) {
    await db.rollback();
    db.close();
    console.error(error);
    return false;
  }
}

// 🔹 UPDATE (TRANSACCIÓN 🔥)
export async function updateAdministrador_put(data: AdministradorInterface): Promise<boolean> {
  try {
    await db.connect();
    await db.beginTransaction();

    const sqlUsuario = `
      UPDATE Usuario
      SET nombreCompleto = ?, correo = ?, contrasena = ?, documento = ?
      WHERE idUsuario = ?
    `;

    const result: any = await db.query(sqlUsuario, [
      data.nombreCompleto,
      data.correo,
      data.contrasena,
      data.documento,
      data.idUsuario,
    ]);

    await db.commit();
    db.close();

    return result.affectedRows > 0;

  } catch (error) {
    await db.rollback();
    db.close();
    console.error(error);
    return false;
  }
}

// 🔹 DELETE (por cascada)
export async function deleteAdministrador_delete(idUsuario: number): Promise<boolean> {
  try {
    await db.connect();

    const sql = `DELETE FROM Usuario WHERE idUsuario = ?`;
    const response: any = await db.query(sql, [idUsuario]);

    db.close();
    return response.affectedRows > 0;

  } catch (error) {
    console.error(error);
    return false;
  }
}