import { Router } from "express";
import ContactController from "../controllers/contactController";

const router: Router = Router();

router.post("/", ContactController.createContact);
router.get("/:id", ContactController.getContact);
router.get("/", ContactController.getAllContact);
router.put("/:id", ContactController.updateContact);
router.delete("/:id", ContactController.deleteContact);
router.post("/isnumber", ContactController.isMobileNumber);

export default router;
