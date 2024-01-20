import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import phoneRoutes from "./routes/phoneRoutes";
import contactRoutes from "./routes/personRoutes";

const app = express();
const port = process.env.PORT || 3000;
const mongoURI =
  "mongodb+srv://bizzyka:w94htX4kekYfuWkH@internal.18brhl0.mongodb.net/";

mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  dbName: "production",
} as mongoose.ConnectOptions);

app.use(bodyParser.json());
app.get("/", (req, res) => {
  res.send("Server is running");
});

app.get("/ping", (req, res) => {
  res.send("pong");
});



app.use("/api", phoneRoutes);
app.use("/api", contactRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
