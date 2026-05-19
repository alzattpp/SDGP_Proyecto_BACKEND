import { Router } from "express";

import { validateSchema }
from "../middleware/validateSchemas.middleware";

import {
  createPagoSchema,
  updatePagoSchema
}
from "../schemas/pago.schemas";

import {

  getPagos,
  getPagoById,
  getPagosByUsuario,
  createPago,
  updatePago,
  deletePago

}
from "../controller/pago.controller";

const router = Router();


// 🔹 GET TODOS
router.get(
  "/getPagos",
  getPagos
);


// 🔹 GET POR ID
router.get(
  "/findPago/:id",
  getPagoById
);


// 🔹 GET POR USUARIO
router.get(
  "/findUsuario/:idUsuario",
  getPagosByUsuario
);


// 🔹 CREATE
router.post(
  "/createPago",
  validateSchema(
    createPagoSchema
  ),
  createPago
);


// 🔹 UPDATE
router.put(
  "/updatePago/:id",
  validateSchema(
    updatePagoSchema
  ),
  updatePago
);


// 🔹 DELETE
router.delete(
  "/delete/:id",
  deletePago
);

export default router;