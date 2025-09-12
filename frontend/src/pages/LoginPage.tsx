import { Box, Typography, Container, TextField, Button } from "@mui/material";
import { useRef, useState } from "react";
import { BASE_URL } from "../api/baseUrl";
import { useAuth } from "../context/Auth/AuthContext";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const [error, setError] = useState("");

  const { login } = useAuth();
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  const navigate = useNavigate();

  const onSubmit = async () => {
    const email = emailRef.current?.value;
    const password = passwordRef.current?.value;

        //validation
    if (!email || !password) {
      setError("All fields are required");
      return;
    }

    //Make  call to Api to register the user
    const response = await fetch(`${BASE_URL}/user/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      setError("Unable to login user, Please try again!");

      return;
    }

    const token = await response.json();
    if (!token) {
      setError("Incorrect token");
      return;
    }

    login(email, token);
    navigate("/");
  };

  return (
    <Container maxWidth={false}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          mt: 5,
        }}
      >
        <Typography variant="h5">Login to Your Account</Typography>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
            mt: 3,
            border: "1px solid #f5f5f5",
            borderRadius: 2,
            p: 2,
          }}
        >
          <TextField
            inputRef={emailRef}
            label="Email"
            name="email"
            variant="outlined"
          />
          <TextField
            inputRef={passwordRef}
            type="password"
            label="Password"
            name="password"
            variant="outlined"
          />
          <Button onClick={onSubmit} variant="contained" color="primary">
            Login
          </Button>
          {error && <Typography color="red">{error}</Typography>}
        </Box>
      </Box>
    </Container>
  );
};

export default LoginPage;
