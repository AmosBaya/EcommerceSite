import { useState } from "react";
import { Box, TextField, Button, Typography, Alert } from "@mui/material";
import { useNavigate, Link } from "react-router-dom";

function Signup() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async () => {
    setError("");
    setLoading(true);
    try {
      const res = await fetch(
        "https://flipkart-backend-7zx7.onrender.com/api/auth/signup",
        {
          method: "POST",
          body: JSON.stringify({ username, email, password }),
          headers: { "Content-Type": "application/json" },
        }
      );
      const data = await res.json();
      if (data.token) {
        localStorage.setItem("token", data.token);
        navigate("/");
      } else {
        setError(data.error || "Signup failed");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Box
        className="w-full max-w-md bg-white rounded-xl shadow-md p-6"
        component="form"
        noValidate
        autoComplete="off"
      >
        <Typography variant="h5" className="font-semibold mb-4 text-center">
          Create Your Account
        </Typography>

        <TextField
          type="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          label="Username"
          fullWidth
          margin="normal"
          variant="outlined"
          required
        />

        <TextField
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          label="Email"
          fullWidth
          margin="normal"
          variant="outlined"
          required
        />
        <TextField
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          label="Password"
          fullWidth
          margin="normal"
          variant="outlined"
          required
        />

        {error && (
          <Alert severity="error" className="mt-3">
            {error}
          </Alert>
        )}

        <Button
          onClick={handleSignup}
          variant="contained"
          color="primary"
          fullWidth
          className="mt-4"
          disabled={!email || !password || loading}
        >
          {loading ? "Signing Up..." : "Sign Up"}
        </Button>

        <Typography variant="body2" className="mt-4 text-center">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-600 hover:underline">
            Login
          </Link>
        </Typography>
      </Box>
    </div>
  );
}

export default Signup;
