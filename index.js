import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./db/db.js";
import userRoute from "./routes/user.routes.js"
import noteRoute from "./routes/note.routes.js"
import path from "path";
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


dotenv.config();

const app = express();
const Port = process.env.PORT || 8080;

app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static(path.join(__dirname, "./client/dist")));

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

app.use(express.json());

connectDB();

//routes
app.use("/api/v1/auth", userRoute);
app.use("/api/v1/note", noteRoute);

app.use('*', function(req,res){
  res.sendFile(path.join(__dirname,"./client/dist/index.html"));
})


app.listen(Port, () => {
  console.log(`Your app is listen on port:${Port}`);
});
