import express from "express";
import dotenv from "dotenv";
import userRoutes from "./src/routes/UserRoutes.js";
import beneficiaryRoutes from "./src/routes/beneficiaryRoutes.js";
import connectDb from "./src/db/index.js";
import cors from "cors";

dotenv.config();

const PORT =process.env.PORT || '3000'
const app = express();

app.use(cors());

app.use(express.json());
app.get("/", (req, res) => {
  return res.status(200).send("Hello World");
});
// app.use("/api/user", userroutes);
app.use('/api/users', userRoutes);
app.use('/api/beneficiaries', beneficiaryRoutes);

connectDb()
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Failed to connect to database:", err);
    process.exit(1);
  });
