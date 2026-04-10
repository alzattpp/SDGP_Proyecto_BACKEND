import { Router } from "express";
import { validateSchema } from "../middleware/validateSchemas.middleware";

import {
  createVehiculoSchema,
  updateVehiculoSchema
} from "../schemas/vehiculo.schema";

import {
  getVehiculos,
  getVehiculoByPlaca,
  createVehiculo,
  updateVehiculo,
  deleteVehiculo
} from "../controller/vehiculos.controller";

const router = Router();

router.get("/getVehiculos", getVehiculos);
router.get("/findVehiculo/:placa", getVehiculoByPlaca);

router.post(
  "/createVehiculo",
  validateSchema(createVehiculoSchema),
  createVehiculo
);

router.put(
  "/updateVehiculo/:placa",
  validateSchema(updateVehiculoSchema),
  updateVehiculo
);

router.delete("/delete/:placa", deleteVehiculo);

export default router;