import { Router } from "express";
import ContactController from "../controllers/contactController";

const router: Router = Router();

router.post("/", ContactController.createContact);
router.get("/", ContactController.getContact);
router.put("/:id", ContactController.updateContact);
router.delete("/", ContactController.deleteContact);
router.get("/new-contacts", ContactController.getNewContacts);

export default router;
