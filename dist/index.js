"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const body_parser_1 = __importDefault(require("body-parser"));
const callRoutes_1 = __importDefault(require("./routes/callRoutes"));
const contactRoutes_1 = __importDefault(require("./routes/contactRoutes"));
const cors_1 = __importDefault(require("cors"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const swaggerDocument_json_1 = __importDefault(require("../swaggerDocument.json"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)({
    origin: false
}));
const port = process.env.PORT || 3000;
const mongoURI = "mongodb+srv://admin:admin@cluster0.8fjfi6m.mongodb.net/?retryWrites=true&w=majority";
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
app.use("/api/call", callRoutes_1.default);
app.use("/api/contact", contactRoutes_1.default);
app.use('/api-docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swaggerDocument_json_1.default));
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
