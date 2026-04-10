import MySQLConnector from '../db/connection';
import { UsuarioInterface } from '../interfaces/intrefaces';

const db = new MySQLConnector();

// 🔹 Obtener todos los usuarios
export async function getUsuarios_get(): Promise<UsuarioInterface[]> {
  try {
    await db.connect();
    const sql = 'SELECT * FROM Usuario';
    const response: any = await db.query(sql);
    db.close();
    return response;
  } catch (error) {
    console.error(error);
    return [];
  }
}

// 🔹 Obtener usuario por ID
export async function getUsuarioById_get(idUsuario: number): Promise<UsuarioInterface | null> {
  try {
    await db.connect();
    const sql = 'SELECT * FROM Usuario WHERE idUsuario = ?';
    const response: any = await db.query(sql, [idUsuario]);
    db.close();
    return response.length > 0 ? response[0] : null;
  } catch (error) {
    console.error(error);
    return null;
  }
}

// 🔹 Crear usuario
export async function createUsuario_post(user: UsuarioInterface): Promise<boolean> {
  try {
    await db.connect();
    const sql = `INSERT INTO Usuario 
      (nombreCompleto, correo, contrasena, documento) 
      VALUES (?, ?, ?, ?)`;
    const response: any = await db.query(sql, [
      user.nombreCompleto,
      user.correo,
      user.contrasena,
      user.documento,
    ]);
    db.close();
    return response.affectedRows > 0;
  } catch (error) {
    console.error(error);
    return false;
  }
}

// 🔹 Actualizar usuario
export async function updateUsuario_put(user: UsuarioInterface): Promise<boolean> {
  try {
    await db.connect();
    const sql = `UPDATE Usuario 
      SET nombreCompleto = ?, correo = ?, contrasena = ?, documento = ? 
      WHERE idUsuario = ?`;
    const response: any = await db.query(sql, [
      user.nombreCompleto,
      user.correo,
      user.contrasena,
      user.documento,
      user.idUsuario,
    ]);
    db.close();
    return response.affectedRows > 0;
  } catch (error) {
    console.error(error);
    return false;
  }
}

// 🔹 Eliminar usuario
export async function deleteUsuario_delete(idUsuario: number): Promise<boolean> {
  try {
    await db.connect();
    const sql = 'DELETE FROM Usuario WHERE idUsuario = ?';
    const response: any = await db.query(sql, [idUsuario]);
    db.close();
    return response.affectedRows > 0;
  } catch (error) {
    console.error(error);
    return false;
  }
}