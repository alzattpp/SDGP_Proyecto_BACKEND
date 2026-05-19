import { Router } from "express";
import { validateSchema } from "../middleware/validateSchemas.middleware";

import {
  createMedioPagoSchema,
  updateMedioPagoSchema
} from "../schemas/mediopago.schemas";

import {
  getMediosPago,
  getMedioPagoById,
  createMedioPago,
  updateMedioPago,
  deleteMedioPago,
  getMedioPagoByUsuario
} from "../controller/mediopago.controller";

const router = Router();

router.get(
  "/getMediosPago",
  getMediosPago
);

router.get(
  "/findMedioPago/:id",
  getMedioPagoById
);

router.post(
  "/createMedioPago",
  validateSchema(createMedioPagoSchema),
  createMedioPago
);

router.put(
  "/updateMedioPago/:id",
  validateSchema(updateMedioPagoSchema),
  updateMedioPago
);

router.delete(
  "/delete/:id",
  deleteMedioPago
);
router.get(
  "/findUsuario/:idUsuario",
  getMedioPagoByUsuario
);

export default router;