"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const callController_1 = __importDefault(require("../controllers/callController"));
const router = (0, express_1.Router)();
router.get("/ivr/pre", callController_1.default.createIVRPre);
router.get("/ivr/post", callController_1.default.createIVRPost);
router.get("/ivr", callController_1.default.getLastCall);
exports.default = router;
