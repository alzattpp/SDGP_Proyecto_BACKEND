import MySQLConnector from '../db/connection';
import { UsuarioInterface } from '../interfaces/intrefaces';

// 🔹 GET todos los usuarios
export async function getUsuarios_get(): Promise<UsuarioInterface[]> {
  const db = new MySQLConnector();
  try {
    const sql = 'SELECT * FROM Usuario';
    const response: any = await db.query(sql);
    return response;
  } catch (error) {
    console.error(error);
    return [];
  } finally {
    await db.close();
  }
}

// 🔹 GET usuario por ID
export async function getUsuarioById_get(idUsuario: number): Promise<UsuarioInterface | null> {
  const db = new MySQLConnector();
  try {
    const sql = 'SELECT * FROM Usuario WHERE idUsuario = ?';
    const response: any = await db.query(sql, [idUsuario]);
    return response.length > 0 ? response[0] : null;
  } catch (error) {
    console.error(error);
    return null;
  } finally {
    await db.close();
  }
}

// 🔹 CREATE usuario (con rol)
export async function createUsuario_post(user: UsuarioInterface): Promise<boolean> {
  const db = new MySQLConnector();
  try {
    const sql = `
      INSERT INTO Usuario 
      (nombreCompleto, correo, contrasena, documento, rol) 
      VALUES (?, ?, ?, ?, ?)
    `;

    const response: any = await db.query(sql, [
      user.nombreCompleto,
      user.correo,
      user.contrasena,
      user.documento,
      user.rol || 'usuario',
    ]);

    return response.affectedRows > 0;
  } catch (error) {
    console.error(error);
    return false;
  } finally {
    await db.close();
  }
}

// 🔹 UPDATE usuario (incluye rol)
export async function updateUsuario_put(user: UsuarioInterface): Promise<boolean> {
  const db = new MySQLConnector();
  try {
    const existing: any = await db.query(
      'SELECT idUsuario FROM Usuario WHERE idUsuario = ?',
      [user.idUsuario]
    );

    if (!existing?.length) {
      return false;
    }

    if (user.contrasena) {
      await db.query(
        `UPDATE Usuario 
         SET nombreCompleto = ?, correo = ?, contrasena = ?, documento = ?, rol = ?
         WHERE idUsuario = ?`,
        [
          user.nombreCompleto,
          user.correo,
          user.contrasena,
          user.documento,
          user.rol,
          user.idUsuario,
        ]
      );
    } else {
      await db.query(
        `UPDATE Usuario 
         SET nombreCompleto = ?, correo = ?, documento = ?, rol = ?
         WHERE idUsuario = ?`,
        [
          user.nombreCompleto,
          user.correo,
          user.documento,
          user.rol,
          user.idUsuario,
        ]
      );
    }

    return true;
  } catch (error) {
    console.error(error);
    return false;
  } finally {
    await db.close();
  }
}

// 🔹 DELETE usuario
export async function deleteUsuario_delete(idUsuario: number): Promise<boolean> {
  const db = new MySQLConnector();
  try {
    const sql = 'DELETE FROM Usuario WHERE idUsuario = ?';
    const response: any = await db.query(sql, [idUsuario]);
    return response.affectedRows > 0;
  } catch (error) {
    console.error(error);
    return false;
  } finally {
    await db.close();
  }
}

// 🔹 AUMENTAR LOGIN
export async function incrementarLogins_put(idUsuario: number): Promise<boolean> {
  const db = new MySQLConnector();
  try {
    const sql = `
      UPDATE Usuario
      SET cantidadLogins = cantidadLogins + 1
      WHERE idUsuario = ?
    `;

    const response: any = await db.query(sql, [idUsuario]);
    return response.affectedRows > 0;
  } catch (error) {
    console.error(error);
    return false;
  } finally {
    await db.close();
  }
}

// 🔹 OBTENER CANTIDAD DE LOGINS
export async function getCantidadLogins_get(idUsuario: number): Promise<number> {
  const db = new MySQLConnector();
  try {
    const sql = `
      SELECT cantidadLogins
      FROM Usuario
      WHERE idUsuario = ?
    `;

    const response: any = await db.query(sql, [idUsuario]);

    if (response.length === 0) {
      return 0;
    }

    return response[0].cantidadLogins;
  } catch (error) {
    console.error(error);
    return 0;
  } finally {
    await db.close();
  }
}
