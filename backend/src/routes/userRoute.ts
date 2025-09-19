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

    // If registration successful and includes token, set HttpOnly cookie
    if (StatusCode === 201 && typeof data === "object" && "token" in data) {
      res.cookie("auth_token", data.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
        path: "/",
      });

      // Remove token from response body for security
      const { token, ...responseData } = data;
      res.status(StatusCode).json(responseData);
    } else {
      res.status(StatusCode).json(data);
    }
  } catch (err) {
    res.status(500).json({ error: "Something went wrong" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const { StatusCode, data } = await login({ email, password });

    // If login successful, set HttpOnly cookie
    if (StatusCode === 200 && typeof data === "object" && "token" in data) {
      res.cookie("auth_token", data.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
        path: "/",
      });

      // Remove token from response body for security
      const { token, ...responseData } = data;
      res.status(StatusCode).json(responseData);
    } else {
      res.status(StatusCode).json(data);
    }
  } catch (err) {
    res.status(500).json({ error: "Something went wrong" });
  }
});

// Add logout route to clear the cookie
router.post("/logout", (req, res) => {
  res.cookie("auth_token", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    expires: new Date(0),
    path: "/",
  });
  res.status(200).json({ message: "Logged out successfully" });
});

// Add route to check auth status
router.get("/me", validateJWT, async (req: ExtendRequest, res) => {
  try {
    const user = req.user;
    res.status(200).json({
      username: `${user.firstName} ${user.lastName}`,
      email: user.email,
      role: user.role || "user",
    });
  } catch (err) {
    res.status(500).json({ error: "Something went wrong" });
  }
});

router.get("/my-orders", validateJWT, async (req: ExtendRequest, res) => {
  try {
    const userId = req.user._id;
    const { statusCode, data } = await getMyOrders({ userId });
    res.status(statusCode).json(data);
  } catch (err) {
    res.status(500).json({ error: "Something went wrong" });
  }
});

export default router;
