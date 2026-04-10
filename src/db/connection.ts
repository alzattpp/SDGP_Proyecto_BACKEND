import mysql from 'mysql2/promise';
require('dotenv').config();

class MySQLConnector {
  public connection: mysql.Connection | null = null;

  async connect() {
    if (!this.connection) {
      const { DBHOST, DBUSER, DBPASSWORD, DBNAME } = process.env;
      this.connection = await mysql.createConnection({
        host: DBHOST,
        user: DBUSER,
        password: DBPASSWORD,
        database: DBNAME,
      });
    }
  }

  async query(sql: string, values?: any) {
    if (!this.connection) throw new Error('No hay conexión activa');
    const [rows] = await this.connection.execute(sql, values);
    return rows;
  }

  async beginTransaction() {
    if (!this.connection) throw new Error('No hay conexión activa');
    await this.connection.beginTransaction();
  }

  async commit() {
    if (!this.connection) throw new Error('No hay conexión activa');
    await this.connection.commit();
  }

  async rollback() {
    if (!this.connection) throw new Error('No hay conexión activa');
    await this.connection.rollback();
  }

  async close() {
    if (this.connection) {
      await this.connection.end();
      this.connection = null;
    }
  }
}

export default MySQLConnector;