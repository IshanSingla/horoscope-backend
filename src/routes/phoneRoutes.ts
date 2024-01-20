import { Router } from "express";
import PhoneController from "../controllers/phoneController";

const router: Router = Router();

router.post("/phone", PhoneController.createPhone);
router.get("/phone/:id", PhoneController.getPhone);
router.put("/phone/:id", PhoneController.updatePhone);
router.delete("/phone/:id", PhoneController.deletePhone);

export default router;
