import mysql from 'mysql2/promise';
require('dotenv').config();

class MySQLConnector {
  private static pool: mysql.Pool | null = null;
  public connection: mysql.PoolConnection | null = null;

  private static getPool(): mysql.Pool {
    if (!MySQLConnector.pool) {
      const { DBHOST, DBUSER, DBPASSWORD, DBNAME } = process.env;
      MySQLConnector.pool = mysql.createPool({
        host: DBHOST,
        user: DBUSER,
        password: DBPASSWORD,
        database: DBNAME,
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0,
      });
    }
    return MySQLConnector.pool;
  }

  /** @deprecated No es necesario para consultas simples; el pool gestiona las conexiones. */
  async connect() {
    // Las consultas sin transacción usan el pool directamente en query().
  }

  private async ensureConnection(): Promise<mysql.PoolConnection> {
    if (!this.connection) {
      this.connection = await MySQLConnector.getPool().getConnection();
    }
    return this.connection;
  }

  async query(sql: string, values?: any) {
    if (this.connection) {
      const [rows] = await this.connection.execute(sql, values);
      return rows;
    }
    const [rows] = await MySQLConnector.getPool().execute(sql, values);
    return rows;
  }

  async beginTransaction() {
    const conn = await this.ensureConnection();
    await conn.beginTransaction();
  }

  async commit() {
    if (!this.connection) throw new Error('No hay conexión activa');
    await this.connection.commit();
  }

  async rollback() {
    if (this.connection) {
      await this.connection.rollback();
    }
  }

  async close() {
    if (this.connection) {
      this.connection.release();
      this.connection = null;
    }
  }
}

export default MySQLConnector;
