import { Router } from "express";

import {

getOcupacionReporte,
getIngresosReporte,
getPagosReporte

}
from "../controller/reporte.controller";

const router=Router();

router.get(
"/ocupacion/:idParqueadero?",
getOcupacionReporte
);

router.get(
"/ingresos/:idParqueadero?",
getIngresosReporte
);

router.get(
"/pagos",
getPagosReporte
);

export default router;