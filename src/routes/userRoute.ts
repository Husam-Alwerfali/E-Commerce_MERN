import express from "express";
import { login, register } from "../../services/userServices.js";

const router = express.Router();

router.post("/register", async (req, res) => {
  const { firstName, lastName, email, password } = req.body;
  const { StatusCode , data} = await register({ firstName, lastName, email, password });
    res.status(StatusCode).send(data);
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const { StatusCode , data} = await login({email, password});
    res.status(StatusCode).send(data);
});

export default router;
