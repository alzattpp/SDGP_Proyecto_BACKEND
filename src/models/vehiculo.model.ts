import MySQLConnector from "../db/connection";
import { VehiculoInterface } from "../interfaces/intrefaces";

const db = new MySQLConnector();

// 🔹 GET ALL
export async function getVehiculos_get(): Promise<VehiculoInterface[]> {
  try {
    await db.connect();

    const sql = `SELECT * FROM Vehiculo`;
    const response: any = await db.query(sql);

    db.close();
    return response;

  } catch (error) {
    console.error(error);
    return [];
  }
}

// 🔹 GET BY PLACA
export async function getVehiculoByPlaca_get(placa: string): Promise<VehiculoInterface | null> {
  try {
    await db.connect();

    const sql = `SELECT * FROM Vehiculo WHERE placa = ?`;
    const response: any = await db.query(sql, [placa]);

    db.close();
    return response.length > 0 ? response[0] : null;

  } catch (error) {
    console.error(error);
    return null;
  }
}

// 🔹 CREATE
export async function createVehiculo_post(data: VehiculoInterface): Promise<boolean> {
  try {
    await db.connect();

    const sql = `
      INSERT INTO Vehiculo (placa, idUsuario, marca)
      VALUES (?, ?, ?)
    `;

    const response: any = await db.query(sql, [
      data.placa,
      data.idUsuario,
      data.marca,
    ]);

    db.close();
    return response.affectedRows > 0;

  } catch (error) {
    console.error(error);
    return false;
  }
}

// 🔹 UPDATE
export async function updateVehiculo_put(data: VehiculoInterface): Promise<boolean> {
  try {
    await db.connect();

    const sql = `
      UPDATE Vehiculo
      SET idUsuario = ?, marca = ?
      WHERE placa = ?
    `;

    const response: any = await db.query(sql, [
      data.idUsuario,
      data.marca,
      data.placa,
    ]);

    db.close();
    return response.affectedRows > 0;

  } catch (error) {
    console.error(error);
    return false;
  }
}

// 🔹 DELETE
export async function deleteVehiculo_delete(placa: string): Promise<boolean> {
  try {
    await db.connect();

    const sql = `DELETE FROM Vehiculo WHERE placa = ?`;
    const response: any = await db.query(sql, [placa]);

    db.close();
    return response.affectedRows > 0;

  } catch (error) {
    console.error(error);
    return false;
  }
}