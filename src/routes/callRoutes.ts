import { Router } from "express";
import CallController from "../controllers/callController";
const router: Router = Router();

router.get("/ivr/pre", CallController.createIVRPre);
router.get("/ivr/post", CallController.createIVRPost);
// router.get("/ivr", CallController.getLastCall);
export default router;

console.log(process.env.DATABASE_URL);
