import express, { Application } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import usuarioRoutes from "./routes/usuario.routes";
import administradorRoutes from "./routes/administrador.routes";
import trabajadorRoutes from "./routes/trabajador.routes";  
import vehiculoRoutes from "./routes/vehiculo.routes";
import parqueaderoRoutes from "./routes/parqueadero.routes";
import ingresoRoutes from "./routes/ingreso.routes";

class Server {
  private app: Application;
  private port: string;

  constructor() {
    this.app = express();
    this.port = process.env.PORT || "3000";
    this.middlewares();
    this.routes();
  }

  listen() {
    this.app.listen(this.port, () => {
      console.log("Aplicacion corriendo por el puerto", this.port);
    });
  }

middlewares() {
  this.app.use(express.json());

  this.app.use(cors({
    origin: 'http://localhost:3001', 
    credentials: true,               
  }));

  this.app.use(cookieParser());
}


  routes() {
    this.app.use("/api/usuarios", usuarioRoutes);
    this.app.use("/api/administradores", administradorRoutes);
    this.app.use("/api/trabajadores", trabajadorRoutes);
    this.app.use("/api/vehiculos", vehiculoRoutes);
    this.app.use("/api/parqueaderos", parqueaderoRoutes);
    this.app.use("/api/ingresos", ingresoRoutes);
  }
}

export default Server;
