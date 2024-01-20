"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const body_parser_1 = __importDefault(require("body-parser"));
const phoneRoutes_1 = __importDefault(require("./routes/phoneRoutes"));
const personRoutes_1 = __importDefault(require("./routes/personRoutes"));
const app = (0, express_1.default)();
const port = process.env.PORT || 3000;
const mongoURI = "mongodb+srv://bizzyka:w94htX4kekYfuWkH@internal.18brhl0.mongodb.net/";
mongoose_1.default.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: "production",
});
app.use(body_parser_1.default.json());
app.get("/", (req, res) => {
    res.send("Server is running");
});
app.get("/ping", (req, res) => {
    res.send("pong");
});
app.get("/region", (req, res) => {
    res.send(`I am an Edge Function! (executed on ${process.env.VERCEL_REGION})`);
});
app.use("/api/phone", phoneRoutes_1.default);
app.use("/api/person", personRoutes_1.default);
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
