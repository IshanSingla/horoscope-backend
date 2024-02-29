"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const contactController_1 = __importDefault(require("../controllers/contactController"));
const router = (0, express_1.Router)();
router.post("/", contactController_1.default.createContact);
router.get("/", contactController_1.default.getContact);
router.put("/:id", contactController_1.default.updateContact);
router.delete("/", contactController_1.default.deleteContact);
router.get("/new-contacts", contactController_1.default.getNewContacts);
exports.default = router;
