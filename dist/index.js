"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.prisma = void 0;
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const body_parser_1 = __importDefault(require("body-parser"));
const callRoutes_1 = __importDefault(require("./routes/callRoutes"));
const contactRoutes_1 = __importDefault(require("./routes/contactRoutes"));
const cors_1 = __importDefault(require("cors"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const swaggerDocument_json_1 = __importDefault(require("../swaggerDocument.json"));
const passport_1 = __importDefault(require("passport"));
const express_session_1 = __importDefault(require("express-session"));
const morgan_1 = __importDefault(require("morgan"));
const passport_2 = require("./middleware/passport");
const dotenv_1 = __importDefault(require("dotenv"));
const client_1 = require("@prisma/client");
const cluster_1 = __importDefault(require("cluster"));
const os_1 = __importDefault(require("os"));
// get the number of cpus
const cpus = os_1.default.availableParallelism() / 2;
const prisma = new client_1.PrismaClient();
exports.prisma = prisma;
if (cluster_1.default.isPrimary) {
    for (let i = 0; i < cpus; i++) {
        cluster_1.default.fork();
    }
}
else {
    const app = (0, express_1.default)();
    dotenv_1.default.config();
    app.use((0, cors_1.default)({
        origin: false,
    }));
    (0, passport_2.initializePassport)(passport_1.default);
    app.use((0, morgan_1.default)("dev"));
    app.use((0, express_session_1.default)({
        secret: "ishan",
        resave: false,
        saveUninitialized: true,
    }));
    app.use(passport_1.default.initialize());
    app.use(passport_1.default.session());
    app.use(body_parser_1.default.json());
    const port = process.env.PORT || 3000;
    const mongoURI = "mongodb+srv://bizzyka:w94htX4kekYfuWkH@internal.18brhl0.mongodb.net/";
    mongoose_1.default.connect(mongoURI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        dbName: "production",
    });
    app.get("/", (req, res) => {
        res.send("Server is running");
    });
    app.get("/login", passport_1.default.authenticate("google", {
        scope: [
            "profile",
            "email",
            "openid",
            "https://www.googleapis.com/auth/contacts",
        ],
    }));
    app.get("/google/callback", passport_1.default.authenticate("google", { failureRedirect: "/" }), (req, res) => {
        res.redirect("/");
    });
    app.get("/ping", (req, res) => {
        res.send("pong");
    });
    app.get("/region", (req, res) => {
        res.send(`I am an Edge Function! (executed on ${process.env.VERCEL_REGION})`);
    });
    app.use("/docs", swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swaggerDocument_json_1.default));
    app.use("/api/call", callRoutes_1.default);
    app.use("/api/contact", contactRoutes_1.default);
    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });
}
