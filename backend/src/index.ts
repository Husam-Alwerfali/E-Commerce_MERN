import dotenv from 'dotenv';
import express from "express";
import mongoose from "mongoose";
import userRoute from "./routes/userRoute.js";
import { seedInitialProducts } from "../services/productService.js";
import productRoute from "./routes/productRoute.js";
import cartRoute from "./routes/cartRoute.js";

dotenv.config();

const app = express();
const port = 3001;

app.use(express.json());

mongoose
  .connect( process.env.DATABASE_URL || "" )
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => console.log("Failed to connect to MongoDB", err));

  app.use('/user',userRoute);
  app.use('/product',productRoute);
  app.use('/cart',cartRoute);


  //Seed the ptoducts to the database
  seedInitialProducts();

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
