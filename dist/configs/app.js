"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const express_session_1 = __importDefault(require("express-session"));
const morgan_1 = __importDefault(require("morgan"));
const dotenv_1 = __importDefault(require("dotenv"));
const passport_1 = require("./passport");
const app = (0, express_1.default)();
exports.app = app;
dotenv_1.default.config();
app.use((0, cors_1.default)({
    origin: false,
}));
app.use((0, morgan_1.default)("dev"));
app.use((0, express_session_1.default)({
    secret: "ishan",
    resave: false,
    saveUninitialized: true,
}));
app.use(passport_1.passport.initialize());
app.use(passport_1.passport.session());
app.use(body_parser_1.default.json());
