import { Router } from "express";
import CallController from "../controllers/callController";
const router: Router = Router();

router.get("/pre", CallController.createIVRPre);
router.get("/post", CallController.createIVRPost);
router.get("/", CallController.getLastCall);
export default router;

