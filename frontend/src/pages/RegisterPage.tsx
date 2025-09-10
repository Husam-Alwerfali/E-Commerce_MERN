import { Box, Typography, Container, TextField, Button } from "@mui/material";
import { useRef, useState } from "react";
import { BASE_URL } from "../api/baseUrl";
import { useAuth } from "../context/Auth/AuthContext";

const RegisterPage = () => {
  const [error, setError] = useState("");

  const { login } = useAuth();
  const firstNameRef = useRef<HTMLInputElement>(null);
  const lastNameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  const onSubmit = async () => {
    const firstName = firstNameRef.current?.value;
    const lastName = lastNameRef.current?.value;
    const email = emailRef.current?.value;
    const password = passwordRef.current?.value;

        //validation
    if (!firstName || !lastName || !email || !password) {
      setError("All fields are required");
      return;
    }

    //Make  call to Api to register the user
    const response = await fetch(`${BASE_URL}/user/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ firstName, lastName, email, password }),
    });

    if (!response.ok) {
      setError("Unable to register user, Please try again!");

      return;
    }

    const token = await response.json();
    if (!token) {
      setError("Incorrect token");
      return;
    }

    login(email, token);
    console.log(token);
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
        <Typography variant="h5">Register New Account</Typography>
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
            inputRef={firstNameRef}
            label="First Name"
            name="lastName"
            variant="outlined"
          />
          <TextField
            inputRef={lastNameRef}
            label="Last Name"
            name="lastName"
            variant="outlined"
          />
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
            Register
          </Button>
          {error && <Typography color="red">{error}</Typography>}
        </Box>
      </Box>
    </Container>
  );
};

export default RegisterPage;
