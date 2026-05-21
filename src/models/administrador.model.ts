import MySQLConnector from "../db/connection";
import { AdministradorInterface } from "../interfaces/intrefaces";

// 🔹 GET ALL
export async function getAdministradores_get(): Promise<any[]> {
  const db = new MySQLConnector();
  try {
    const sql = `
      SELECT a.idAdmin, u.idUsuario, u.nombreCompleto, u.correo, u.documento
      FROM Administrador a
      INNER JOIN Usuario u ON a.idUsuario = u.idUsuario
    `;
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
export async function getAdministradorById_get(idAdmin: number): Promise<any | null> {
  const db = new MySQLConnector();
  try {
    const sql = `
      SELECT a.idAdmin, u.idUsuario, u.nombreCompleto, u.correo, u.documento
      FROM Administrador a
      INNER JOIN Usuario u ON a.idUsuario = u.idUsuario
      WHERE a.idAdmin = ?
    `;
    const response: any = await db.query(sql, [idAdmin]);
    return response.length > 0 ? response[0] : null;
  } catch (error) {
    console.error(error);
    return null;
  } finally {
    await db.close();
  }
}

export async function createAdministrador_post(data: AdministradorInterface): Promise<boolean> {
  const db = new MySQLConnector();
  try {
    await db.beginTransaction();

    const sqlUsuario = `
      INSERT INTO Usuario (nombreCompleto, correo, contrasena, documento, rol)
      VALUES (?, ?, ?, ?, ?)
    `;

    const resultUsuario: any = await db.query(sqlUsuario, [
      data.nombreCompleto,
      data.correo,
      data.contrasena,
      data.documento,
      "admin",
    ]);

    const idUsuario = resultUsuario.insertId;

    const sqlAdmin = `
      INSERT INTO Administrador (idUsuario)
      VALUES (?)
    `;

    const resultAdmin: any = await db.query(sqlAdmin, [idUsuario]);

    await db.commit();
    return resultAdmin.affectedRows > 0;
  } catch (error) {
    await db.rollback();
    console.error(error);
    return false;
  } finally {
    await db.close();
  }
}

// 🔹 UPDATE (TRANSACCIÓN)
export async function updateAdministrador_put(data: AdministradorInterface): Promise<boolean> {
  const db = new MySQLConnector();
  try {
    await db.beginTransaction();

    const existing: any = await db.query(
      "SELECT idUsuario FROM Administrador WHERE idAdmin = ?",
      [data.idAdmin]
    );

    if (!existing?.length) {
      await db.rollback();
      return false;
    }

    const idUsuario = existing[0].idUsuario;

    if (data.contrasena) {
      await db.query(
        `UPDATE Usuario
         SET nombreCompleto = ?, correo = ?, contrasena = ?, documento = ?, rol = 'admin'
         WHERE idUsuario = ?`,
        [
          data.nombreCompleto,
          data.correo,
          data.contrasena,
          data.documento,
          idUsuario,
        ]
      );
    } else {
      await db.query(
        `UPDATE Usuario
         SET nombreCompleto = ?, correo = ?, documento = ?, rol = 'admin'
         WHERE idUsuario = ?`,
        [data.nombreCompleto, data.correo, data.documento, idUsuario]
      );
    }

    await db.commit();
    return true;
  } catch (error) {
    await db.rollback();
    console.error(error);
    return false;
  } finally {
    await db.close();
  }
}

// 🔹 DELETE (por cascada)
export async function deleteAdministrador_delete(idUsuario: number): Promise<boolean> {
  const db = new MySQLConnector();
  try {
    const sql = `DELETE FROM Usuario WHERE idUsuario = ?`;
    const response: any = await db.query(sql, [idUsuario]);
    return response.affectedRows > 0;
  } catch (error) {
    console.error(error);
    return false;
  } finally {
    await db.close();
  }
}
