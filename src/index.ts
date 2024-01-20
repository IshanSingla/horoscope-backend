import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import phoneRoutes from "./routes/phoneRoutes";
import contactRoutes from "./routes/personRoutes";

const app = express();
const port = process.env.PORT || 3000;
const mongoURI =
  "mongodb+srv://horoscope:horoscope123@horoscope.5smkdto.mongodb.net/";

mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
} as mongoose.ConnectOptions);

app.use(bodyParser.json());



app.use("/api", phoneRoutes);
app.use("/api", contactRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
