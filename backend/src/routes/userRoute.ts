import express from "express";
import { login, register } from "../../services/userServices.js";

const router = express.Router();

router.post("/register", async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;
    const { StatusCode, data } = await register({
      firstName,
      lastName,
      email,
      password,
    });
    res.status(StatusCode).json(data);
  } catch (err) {
    res.status(500).send("  Something went wrong ");
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const { StatusCode, data } = await login({ email, password });
    res.status(StatusCode).json(data);
  } catch (err) {
    res.status(500).send("  Something went wrong ");
  }
});

export default router;
