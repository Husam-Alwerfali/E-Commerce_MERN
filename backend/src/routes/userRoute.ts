import express from "express";
import { getMyOrders, login, register } from "../../services/userServices.js";
import validateJWT from "../../middlewares/ValidatwJWT.js";
import type { ExtendRequest } from "../../types/extendedRequest.js";

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

router.get("/my-orders", validateJWT, async (req: ExtendRequest, res) => {
  try {
      const userId = req.user._id;
      const {statusCode , data} = await getMyOrders({ userId});
      res.status(statusCode).send(data);
    } catch (err) {
      res.status(500).send("  Something went wrong ");
    }
});

export default router;
