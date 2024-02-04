import { Router } from "express";
import CallController from "../controllers/callController";

const router: Router = Router();

router.post("/", CallController.createCall);
router.get("/", CallController.getLastCall);

export default router;
