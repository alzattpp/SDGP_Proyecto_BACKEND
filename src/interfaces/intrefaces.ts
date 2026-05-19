export interface UsuarioInterface {
  idUsuario?: number;
  nombreCompleto: string;
  correo: string;
  contrasena: string;
  documento: string;
  rol: string;
  cantidadLogins?: number;

}

export interface TrabajadorInterface {
  idTrabajador?: number;
  idUsuario?: number;
  nombreCompleto: string;
  correo: string;
  contrasena: string;
  documento: string;
  telefono: string;
  idParqueadero: number;
}

export interface AdministradorInterface {
  idAdmin?: number;
  idUsuario?: number;
  nombreCompleto: string;
  correo: string;
  contrasena: string;
  documento: string;
}

export interface ParqueaderoInterface {
  idParqueadero?: number;
  nombre: string;
  capacidadMaxima: number;
  requierePago: boolean;
}

export interface VehiculoInterface {
  placa: string;
  idUsuario: number;
  marca: string;
}

export interface IngresoInterface {
  idIngreso?: number;
  placa: string;
  idParqueadero: number;
  horaIngreso: string; // ISO string
  horaSalida?: string;
  estado: string;
}

export interface MedioPagoInterface {
  idMedioPago?: number;
  idUsuario: number;
  tipo: string;
  numeroReferencia: string;
  cvv?: string;
  estado?: string;
}

export interface PagoInterface {
  idPago?: number;
  idIngreso?: number;
  idUsuario: number;
  idMedioPago: number;
  fecha: string; 
  monto: number;
  estado?: string;
}

export interface ReservaInterface {
  idReserva?: number;
  idParqueadero: number;
  idUsuario: number;
  placa: string;
  fecha: string;
  estado?: string;
}