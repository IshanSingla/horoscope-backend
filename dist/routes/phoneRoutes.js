"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const phoneController_1 = __importDefault(require("../controllers/phoneController"));
const router = (0, express_1.Router)();
router.post("/", phoneController_1.default.createPhone);
router.get("/", phoneController_1.default.getPhone);
router.put("/:id", phoneController_1.default.updatePhone);
router.delete("/:id", phoneController_1.default.deletePhone);
exports.default = router;
