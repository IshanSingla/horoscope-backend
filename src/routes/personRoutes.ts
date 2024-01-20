import { Router } from "express";
import PersonController from "../controllers/personController";

const router: Router = Router();

router.post("/person", PersonController.createPerson);
router.get("/person/:id", PersonController.getPerson);
router.get("/person", PersonController.getAllPerson);
router.put("/person/:id", PersonController.updatePerson);
router.delete("/person/:id", PersonController.deletePerson);

export default router;
