import { Router } from "express";

import {
  getOcupacionReporte,
  getIngresosReporte,
  getPagosReporte
} from "../controller/reporte.controller";

const router = Router();


// 🔹 ocupacion actual
router.get(
  "/ocupacion/:idParqueadero?",
  getOcupacionReporte
);


// 🔹 ingresos vehiculares
router.get(
  "/ingresos/:idParqueadero?",
  getIngresosReporte
);


// 🔹 pagos realizados
router.get(
  "/pagos",
  getPagosReporte
);

export default router;