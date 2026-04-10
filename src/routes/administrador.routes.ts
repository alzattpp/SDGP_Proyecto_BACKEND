import { Router } from "express";
import { validateSchema } from "../middleware/validateSchemas.middleware";

import {
  createAdministradorSchema,
  updateAdministradorSchema
} from "../schemas/administrador.schemas";

import {
  getAdministradores,
  getAdministradorById,
  createAdministrador,
  updateAdministrador,
  deleteAdministrador
} from "../controller/administrador.controller";

const router = Router();

router.get("/getAdministradores", getAdministradores);
router.get("/findAdministradorById/:id", getAdministradorById);

router.post(
  "/createAdministrador",
  validateSchema(createAdministradorSchema),
  createAdministrador
);

router.put(
  "/updateAdministrador/:id",
  validateSchema(updateAdministradorSchema),
  updateAdministrador
);

router.delete("/delete/:idUsuario", deleteAdministrador);

export default router;