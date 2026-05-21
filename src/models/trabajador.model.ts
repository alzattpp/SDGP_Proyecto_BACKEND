import MySQLConnector from "../db/connection";
import { TrabajadorInterface } from "../interfaces/intrefaces";

// 🔹 GET todos los trabajadores (JOIN)
export async function getTrabajadores_get(): Promise<any[]> {
  const db = new MySQLConnector();
  try {
    const sql = `
      SELECT t.idTrabajador, u.idUsuario, u.nombreCompleto, u.correo, u.documento,
             t.telefono, t.idParqueadero
      FROM Trabajador t
      INNER JOIN Usuario u ON t.idUsuario = u.idUsuario
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

// 🔹 GET trabajador por ID
export async function getTrabajadorById_get(idTrabajador: number): Promise<any | null> {
  const db = new MySQLConnector();
  try {
    const sql = `
      SELECT t.idTrabajador, u.idUsuario, u.nombreCompleto, u.correo, u.documento,
             t.telefono, t.idParqueadero
      FROM Trabajador t
      INNER JOIN Usuario u ON t.idUsuario = u.idUsuario
      WHERE t.idTrabajador = ?
    `;
    const response: any = await db.query(sql, [idTrabajador]);
    return response.length > 0 ? response[0] : null;
  } catch (error) {
    console.error(error);
    return null;
  } finally {
    await db.close();
  }
}

// 🔹 CREATE (TRANSACCIÓN)
export async function createTrabajador_post(data: TrabajadorInterface): Promise<boolean> {
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
      "trabajador",
    ]);

    const idUsuario = resultUsuario.insertId;

    const sqlTrabajador = `
      INSERT INTO Trabajador (idUsuario, telefono, idParqueadero)
      VALUES (?, ?, ?)
    `;

    const resultTrabajador: any = await db.query(sqlTrabajador, [
      idUsuario,
      data.telefono,
      data.idParqueadero,
    ]);

    await db.commit();
    return resultTrabajador.affectedRows > 0;
  } catch (error) {
    await db.rollback();
    console.error(error);
    return false;
  } finally {
    await db.close();
  }
}

// 🔹 UPDATE (TRANSACCIÓN)
export async function updateTrabajador_put(data: TrabajadorInterface): Promise<boolean> {
  const db = new MySQLConnector();
  try {
    await db.beginTransaction();

    const existing: any = await db.query(
      "SELECT idUsuario FROM Trabajador WHERE idTrabajador = ?",
      [data.idTrabajador]
    );

    if (!existing?.length) {
      await db.rollback();
      return false;
    }

    const idUsuario = existing[0].idUsuario;

    if (data.contrasena) {
      await db.query(
        `UPDATE Usuario
         SET nombreCompleto = ?, correo = ?, contrasena = ?, documento = ?, rol = 'trabajador'
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
         SET nombreCompleto = ?, correo = ?, documento = ?, rol = 'trabajador'
         WHERE idUsuario = ?`,
        [data.nombreCompleto, data.correo, data.documento, idUsuario]
      );
    }

    await db.query(
      `UPDATE Trabajador
       SET telefono = ?, idParqueadero = ?
       WHERE idTrabajador = ?`,
      [data.telefono, data.idParqueadero, data.idTrabajador]
    );

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

// 🔹 DELETE (borra usuario y cascada elimina trabajador)
export async function deleteTrabajador_delete(idUsuario: number): Promise<boolean> {
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
