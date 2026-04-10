import { Router } from "express";
import { validateSchema } from "../middleware/validateSchemas.middleware";

import {
  createUsuarioSchema,
  updateUsuarioSchema,
  loginUsuarioSchema
} from "../schemas/usuario.schemas";

import {
  getUsuarios,
  getUsuarioById,
  createUsuario,
  updateUsuario,
  deleteUsuario,
  loginUsuario,
  logoutUsuario,
  getCurrentUsuario
} from "../controller/usuario.controller";

const router = Router();

router.get("/getUsuarios", getUsuarios);
router.get("/findUsuarioById/:id", getUsuarioById);
router.post("/createUsuario", validateSchema(createUsuarioSchema), createUsuario);
router.put("/updateUsuario/:id", validateSchema(updateUsuarioSchema), updateUsuario);
router.delete("/delete/:id", deleteUsuario);
router.post("/login", validateSchema(loginUsuarioSchema), loginUsuario);
router.post("/logout", logoutUsuario);
router.get("/me", getCurrentUsuario);

export default router;