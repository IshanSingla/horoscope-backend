"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const callRoutes_1 = __importDefault(require("./routes/callRoutes"));
const contactRoutes_1 = __importDefault(require("./routes/contactRoutes"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const swaggerDocument_json_1 = __importDefault(require("../swaggerDocument.json"));
const passport_1 = require("./configs/passport");
const app_1 = require("./configs/app");
const port = process.env.PORT || 3000;
app_1.app.get("/", (req, res) => {
    res.send("Server is running");
});
app_1.app.get("/login", passport_1.passport.authenticate("google", {
    scope: [
        "profile",
        "email",
        "openid",
        "https://www.googleapis.com/auth/contacts",
    ],
}));
app_1.app.get("/google/callback", passport_1.passport.authenticate("google", { failureRedirect: "/" }), (req, res) => {
    res.send("Login Successful");
});
app_1.app.get("/ping", (req, res) => {
    res.send("pong");
});
app_1.app.get("/region", (req, res) => {
    res.send(`I am an Edge Function! (executed on ${process.env.VERCEL_REGION})`);
});
app_1.app.use("/docs", swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swaggerDocument_json_1.default));
app_1.app.use("/api/ivr", callRoutes_1.default);
app_1.app.use("/api/contact", contactRoutes_1.default);
app_1.app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
