"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const phoneController_1 = __importDefault(require("../controllers/phoneController"));
const router = (0, express_1.Router)();
router.post("/phone", phoneController_1.default.createPhone);
router.get("/phone/:id", phoneController_1.default.getPhone);
router.put("/phone/:id", phoneController_1.default.updatePhone);
router.delete("/phone/:id", phoneController_1.default.deletePhone);
exports.default = router;
