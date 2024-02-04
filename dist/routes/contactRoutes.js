"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const contactController_1 = __importDefault(require("../controllers/contactController"));
const router = (0, express_1.Router)();
router.post("/", contactController_1.default.createContact);
router.get("/:id", contactController_1.default.getContact);
router.get("/", contactController_1.default.getAllContact);
router.put("/:id", contactController_1.default.updateContact);
router.delete("/:id", contactController_1.default.deleteContact);
router.post("/isnumber", contactController_1.default.isMobileNumber);
exports.default = router;
