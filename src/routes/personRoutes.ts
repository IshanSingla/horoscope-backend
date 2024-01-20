import { Router } from "express";
import PersonController from "../controllers/personController";

const router: Router = Router();

router.post("/", PersonController.createPerson);
router.get("/:id", PersonController.getPerson);
router.get("/", PersonController.getAllPerson);
router.put("/:id", PersonController.updatePerson);
router.delete("/:id", PersonController.deletePerson);

export default router;
