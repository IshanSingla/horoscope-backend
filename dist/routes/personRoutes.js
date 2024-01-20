"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const personController_1 = __importDefault(require("../controllers/personController"));
const router = (0, express_1.Router)();
router.post("/", personController_1.default.createPerson);
router.get("/:id", personController_1.default.getPerson);
router.get("/", personController_1.default.getAllPerson);
router.put("/:id", personController_1.default.updatePerson);
router.delete("/:id", personController_1.default.deletePerson);
exports.default = router;
