import MySQLConnector from "../db/connection";
import { TrabajadorInterface } from "../interfaces/intrefaces";

const db = new MySQLConnector();

// 🔹 GET todos los trabajadores (JOIN)
export async function getTrabajadores_get(): Promise<any[]> {
  try {
    await db.connect();

    const sql = `
      SELECT t.idTrabajador, u.idUsuario, u.nombreCompleto, u.correo, u.documento,
             t.telefono, t.idParqueadero
      FROM Trabajador t
      INNER JOIN Usuario u ON t.idUsuario = u.idUsuario
    `;

    const response: any = await db.query(sql);
    db.close();
    return response;

  } catch (error) {
    console.error(error);
    return [];
  }
}

// 🔹 GET trabajador por ID
export async function getTrabajadorById_get(idTrabajador: number): Promise<any | null> {
  try {
    await db.connect();

    const sql = `
      SELECT t.idTrabajador, u.idUsuario, u.nombreCompleto, u.correo, u.documento,
             t.telefono, t.idParqueadero
      FROM Trabajador t
      INNER JOIN Usuario u ON t.idUsuario = u.idUsuario
      WHERE t.idTrabajador = ?
    `;

    const response: any = await db.query(sql, [idTrabajador]);
    db.close();

    return response.length > 0 ? response[0] : null;

  } catch (error) {
    console.error(error);
    return null;
  }
}

// 🔹 CREATE (TRANSACCIÓN 🔥)
export async function createTrabajador_post(data: TrabajadorInterface): Promise<boolean> {
  try {
    await db.connect();
    await db.beginTransaction();

    // 🔥 AQUÍ VA EL CAMBIO
    const sqlUsuario = `
      INSERT INTO Usuario (nombreCompleto, correo, contrasena, documento, rol)
      VALUES (?, ?, ?, ?, ?)
    `;

    const resultUsuario: any = await db.query(sqlUsuario, [
      data.nombreCompleto,
      data.correo,
      data.contrasena,
      data.documento,
      "trabajador" // 🔥 CLAVE
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
    db.close();

    return resultTrabajador.affectedRows > 0;

  } catch (error) {
    await db.rollback();
    db.close();
    console.error(error);
    return false;
  }
}

// 🔹 UPDATE (TRANSACCIÓN 🔥)
export async function updateTrabajador_put(data: TrabajadorInterface): Promise<boolean> {
  try {
    await db.connect();
    await db.beginTransaction();

    // 1. actualizar usuario
const sqlUsuario = `
  UPDATE Usuario
  SET nombreCompleto = ?, correo = ?, contrasena = ?, documento = ?, rol = 'trabajador'
  WHERE idUsuario = ?
`;

    await db.query(sqlUsuario, [
      data.nombreCompleto,
      data.correo,
      data.contrasena,
      data.documento,
      data.idUsuario,
    ]);

    // 2. actualizar trabajador
    const sqlTrabajador = `
      UPDATE Trabajador
      SET telefono = ?, idParqueadero = ?
      WHERE idTrabajador = ?
    `;

    const resultTrabajador: any = await db.query(sqlTrabajador, [
      data.telefono,
      data.idParqueadero,
      data.idTrabajador,
    ]);

    await db.commit();
    db.close();

    return resultTrabajador.affectedRows > 0;

  } catch (error) {
    await db.rollback();
    db.close();
    console.error(error);
    return false;
  }
}


// 🔹 DELETE (borra usuario y cascada elimina trabajador)
export async function deleteTrabajador_delete(idUsuario: number): Promise<boolean> {
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