import { Router } from "express";
import PhoneController from "../controllers/phoneController";

const router: Router = Router();

router.post("/", PhoneController.createPhone);
router.get("/", PhoneController.getPhone);
router.put("/:id", PhoneController.updatePhone);
router.delete("/:id", PhoneController.deletePhone);

export default router;
