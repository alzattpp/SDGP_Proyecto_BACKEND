import { Router } from "express";
import { validateSchema } from "../middleware/validateSchemas.middleware";

import {
  createIngresoSchema
} from "../schemas/ingreso.schema";

import {
  getIngresos,
  getIngresoById,
  createIngreso,
  updateIngreso,
  deleteIngreso
} from "../controller/ingreso.controller";

const router = Router();

router.get("/getIngresos", getIngresos);
router.get("/findIngreso/:id", getIngresoById);

router.post(
  "/createIngreso",
  validateSchema(createIngresoSchema),
  createIngreso
);

router.put(
  "/salida/:id",
  updateIngreso
);

router.delete("/delete/:id", deleteIngreso);

export default router;