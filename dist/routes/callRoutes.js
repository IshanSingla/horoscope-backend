"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const callController_1 = __importDefault(require("../controllers/callController"));
const router = (0, express_1.Router)();
router.post("/", callController_1.default.createCall);
router.get("/", callController_1.default.getCall);
router.put("/:id", callController_1.default.updateCall);
router.delete("/:id", callController_1.default.deleteCall);
router.get("/getlastcall", callController_1.default.getLastCall);
exports.default = router;
