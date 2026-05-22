import { Router } from "express";

import {
  getOcupacionReporte,
  getIngresosReporte,
  getPagosReporte
} from "../controller/reporte.controller";

const router = Router();


// 🔹 ocupacion
router.get(
    "/ocupacion",
    getOcupacionReporte
);

router.get(
    "/ocupacion/:idParqueadero",
    getOcupacionReporte
);


// 🔹 ingresos
router.get(
    "/ingresos",
    getIngresosReporte
);

router.get(
    "/ingresos/:idParqueadero",
    getIngresosReporte
);


// 🔹 pagos
router.get(
    "/pagos",
    getPagosReporte
);

export default router;