// Login.jsx
// eslint-disable-next-line no-unused-vars
import { Box, Button, TextField, Typography } from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import authApi from "../api/authApi";

const contentWidth = 240;

const Login = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formErrors, setFormErrors] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormErrors([]);
    const form = new FormData(e.currentTarget);
    const username = form.get("username")?.toString().trim() || "";
    const password = form.get("password")?.toString().trim() || "";
    let errors = [];
    if (!username && !password) errors.push("Please fill in all fields.");
    if (errors.length) {
      setFormErrors(errors);
      return;
    }
    setLoading(true);
    try {
      const res = await authApi.login({ username, password });
      localStorage.setItem("token", res.token);
      navigate("/");
    } catch (err) {
      const apiErrors = err.data?.errors || [];
      const msgs = apiErrors.map((e) => e.msg);
      setFormErrors(msgs);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      component="main"
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        pt: 0,
        px: 2,
      }}
    >
      <Typography
        variant="subtitle1"
        align="center"
        sx={{
          width: contentWidth,
          mb: 1.5,
          fontSize: "18px",
          fontFamily: {
            xs: "'Great Vibes', cursive",
            sm: "'Dancing Script', cursive",
          },
          fontWeight: 100,
          color: "text.secondary",
          lineHeight: 1.3,
        }}
      >
        Let's Go...
      </Typography>

      {/* Login Form */}
      <Box
        component="form"
        onSubmit={handleSubmit}
        noValidate
        sx={{
          width: "100%",
          maxWidth: contentWidth,
          bgcolor: "background.paper",
          px: 1.8,
          pt: 1,
          pb: 1.4,
          borderRadius: 1,
          boxShadow: 0.5,
          "& input": { fontSize: 11 },
          "& .MuiFormHelperText-root": { fontSize: 9 },
        }}
      >
        {/* Username */}
        <Typography sx={{ fontSize: 11, mb: 0.3 }}>Username</Typography>
        <TextField
          fullWidth
          id="username"
          name="username"
          placeholder="Enter username"
          disabled={loading}
          variant="outlined"
          size="small"
          autoComplete="username"
          sx={{
        
            "& .MuiOutlinedInput-root": {
              backgroundColor: "transparent", 
           
              "& .MuiOutlinedInput-input": {
                height: 30,
                fontSize: 11,
                backgroundColor: "transparent",
           
                boxSizing: "border-box",
              },
          
              "& input:-webkit-autofill, & input:-webkit-autofill:focus, & input:-webkit-autofill:hover": {
                WebkitBoxShadow: "0 0 0 1000px transparent inset",
                boxShadow: "0 0 0 1000px transparent inset",
                WebkitTextFillColor: "currentColor",
              },
              "& .MuiOutlinedInput-input:-webkit-autofill, & .MuiOutlinedInput-input:-webkit-autofill:focus": {
                WebkitBoxShadow: "0 0 0 1000px transparent inset",
                boxShadow: "0 0 0 1000px transparent inset",
                WebkitTextFillColor: "currentColor",
              },
            },
    
            "& input:-webkit-autofill::first-line": {
              WebkitTextFillColor: "currentColor",
            },
          }}
        />

        {/* Password */}
        <Typography sx={{ fontSize: 11, mt: 0.8, mb: 0.3 }}>
          Password
        </Typography>
        <TextField
          fullWidth
          id="password"
          name="password"
          type="password"
          placeholder="Enter password"
          disabled={loading}
          variant="outlined"
          size="small"
          autoComplete="current-password"
          sx={{
            "& .MuiOutlinedInput-root": {
              backgroundColor: "transparent",
              "& .MuiOutlinedInput-input": {
                height: 30,
                fontSize: 11,
                backgroundColor: "transparent",
                boxSizing: "border-box",
              },
              "& input:-webkit-autofill, & input:-webkit-autofill:focus, & input:-webkit-autofill:hover": {
                WebkitBoxShadow: "0 0 0 1000px transparent inset",
                boxShadow: "0 0 0 1000px transparent inset",
                WebkitTextFillColor: "currentColor",
              },
              "& .MuiOutlinedInput-input:-webkit-autofill, & .MuiOutlinedInput-input:-webkit-autofill:focus": {
                WebkitBoxShadow: "0 0 0 1000px transparent inset",
                boxShadow: "0 0 0 1000px transparent inset",
                WebkitTextFillColor: "currentColor",
              },
            },
            "& input:-webkit-autofill::first-line": {
              WebkitTextFillColor: "currentColor",
            },
          }}
        />

        <LoadingButton
          type="submit"
          fullWidth
          variant="contained"
          color="primary"
          loading={loading}
          sx={{
            mt: 1.2,
            fontSize: 11,
            textTransform: "none",
            height: 28,
            borderRadius: 1,
          }}
        >
          Sign In
        </LoadingButton>

        <Button
          component={Link}
          to="/signup"
          fullWidth
          sx={{
            mt: 0.5,
            textTransform: "none",
            fontSize: 10.5,
            color: "text.secondary",
          }}
        >
          Don't have an account? Signup
        </Button>

        {/* Validation messages below signup */}
        {formErrors.length > 0 && (
          <Box
            sx={{
              mt: 1,
              textAlign: "center",
              color: "error.main",
              fontSize: 10.5,
              lineHeight: 1.4,
            }}
          >
            {formErrors.map((msg, index) => (
              <Typography key={index} sx={{ fontSize: 10.5 }}>
                {msg}
              </Typography>
            ))}
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default Login;
