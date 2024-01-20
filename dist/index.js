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
const mongoURI = "mongodb+srv://horoscope:horoscope123@horoscope.5smkdto.mongodb.net/";
mongoose_1.default.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});
app.use(body_parser_1.default.json());
app.use("/api", phoneRoutes_1.default);
app.use("/api", personRoutes_1.default);
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
