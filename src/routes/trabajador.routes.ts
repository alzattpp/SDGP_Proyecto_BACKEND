import { Router } from "express";
import { validateSchema } from "../middleware/validateSchemas.middleware";

import {
  createTrabajadorSchema,
  updateTrabajadorSchema
} from "../schemas/trabajador.schemas";

import {
  getTrabajadores,
  getTrabajadorById,
  createTrabajador,
  updateTrabajador,
  deleteTrabajador
} from "../controller/trabajador.controller";

const router = Router();

router.get("/getTrabajadores", getTrabajadores);
router.get("/findTrabajadorById/:id", getTrabajadorById);
router.post(
  "/createTrabajador",
  validateSchema(createTrabajadorSchema),
  createTrabajador
);
router.put(
  "/updateTrabajador/:id",
  validateSchema(updateTrabajadorSchema),
  updateTrabajador
);
router.delete("/delete/:idUsuario", deleteTrabajador);

export default router;