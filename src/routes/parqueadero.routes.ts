import { Router } from "express";
import { validateSchema } from "../middleware/validateSchemas.middleware";

import {
  createParqueaderoSchema,
  updateParqueaderoSchema
} from "../schemas/parqueadero.schemas";

import {
  getParqueaderos,
  getParqueaderoById,
  createParqueadero,
  updateParqueadero,
  deleteParqueadero,
  getParqueaderoStats
} from "../controller/parqueadero.controller";

const router = Router();

router.get("/getParqueaderos", getParqueaderos);
router.get("/findParqueadero/:id", getParqueaderoById);

router.post(
  "/createParqueadero",
  validateSchema(createParqueaderoSchema),
  createParqueadero
);

router.put(
  "/updateParqueadero/:id",
  validateSchema(updateParqueaderoSchema),
  updateParqueadero
);

router.delete("/delete/:id", deleteParqueadero);

router.get("/stats/:id", getParqueaderoStats);
export default router;