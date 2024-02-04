import { Router } from "express";
import CallController from "../controllers/callController";

const router: Router = Router();

router.post("/", CallController.createCall);
router.get("/", CallController.getCall);
router.put("/:id", CallController.updateCall);
router.delete("/:id", CallController.deleteCall);
router.get("/getlastcall", CallController.getLastCall);

export default router;
