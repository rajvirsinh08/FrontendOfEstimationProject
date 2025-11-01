import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../Store/store";
import { setUser } from "../Store/userSlice";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../axiosInstance";
// import { setUser } from "../store/userSlice";
// import type { AppDispatch } from "../store/store";

const Signin: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate(); // ✅ initialize navigate

  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoading(true);
//     setError("");

//     try {
//       const response = await fetch("http://localhost:5000/api/users/signin", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(form),
//       });

//       const data = await response.json();

//       if (!response.ok) {
//         setError(data.message || "Signin failed");
//       } else {
//         // Store data in Redux instead of localStorage
//         dispatch(
//           setUser({
//             token: data.token,
//             email: data.user.email,
//             role: data.user.role,
//           })
//         );

//         alert("Signin successful!");
//         console.log("User:", data.user);
//           // ✅ Navigate to admin homepage
// navigate("/adminHomepage", { replace: true });
//       }
//     } catch (err) {
//       setError("Server error. Please try again later.");
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   };
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);
  setError("");

  try {
    const response = await axiosInstance.post("/users/signin", form); // ✅ not full URL
    const data = response.data;

    dispatch(setUser({
      token: data.token,
      email: data.user.email,
      role: data.user.role,
    }));

    alert("Signin successful!");
    navigate("/adminHomepage", { replace: true });

  } catch (err: any) {
    console.error(err);
    setError(err.response?.data?.message || "Signin failed");
  } finally {
    setLoading(false);
  }
};
  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h1 style={styles.title}>Sign In</h1>
        <p style={styles.subtitle}>
          Welcome back! Please login to your account.
        </p>
        {error && <p style={{ color: "red", fontSize: "14px" }}>{error}</p>}
        <form onSubmit={handleSubmit} style={styles.form}>
          <label style={styles.label}>
            Email
            <input
              style={styles.input}
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              placeholder="example@email.com"
            />
          </label>

          <label style={styles.label}>
            Password
            <div style={styles.passwordWrapper}>
              <input
                style={{ ...styles.input, flex: 1 }}
                type={showPassword ? "text" : "password"}
                name="password"
                value={form.password}
                onChange={handleChange}
                required
                placeholder="Enter password"
              />
            </div>
          </label>

          <div style={styles.forgotPassword}>
            <a href="/forgot-password">Forgot Password?</a>
          </div>

          <button type="submit" style={styles.submitBtn} disabled={loading}>
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>
        <p style={styles.loginLink}>
          Don't have an account? <a href="/">Sign Up</a>
        </p>
      </div>
    </div>
  );
};

// Inline styles (same as before)
const styles: { [key: string]: React.CSSProperties } = {
  page: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
    background: "#f4f6f8",
    padding: "20px",
    fontFamily: "'Inter', sans-serif",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: "12px",
    padding: "40px 30px",
    width: "100%",
    maxWidth: "400px",
    boxShadow: "0px 20px 40px rgba(0, 0, 0, 0.15)",
    textAlign: "center",
  },
  title: { marginBottom: "10px", fontSize: "28px", color: "#333" },
  subtitle: { color: "#666", marginBottom: "30px", fontSize: "14px" },
  form: { display: "flex", flexDirection: "column", gap: "20px" },
  label: {
    display: "flex",
    flexDirection: "column",
    textAlign: "left",
    fontSize: "14px",
    color: "#555",
  },
  input: {
    padding: "12px 15px",
    marginTop: "5px",
    border: "1px solid #ccc",
    borderRadius: "8px",
    fontSize: "14px",
    outline: "none",
    boxSizing: "border-box",
  },
  passwordWrapper: { display: "flex", alignItems: "center", gap: "10px" },
  toggleBtn: {
    padding: "8px 12px",
    fontSize: "12px",
    backgroundColor: "#667eea",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
  },
  submitBtn: {
    padding: "15px",
    backgroundColor: "#764ba2",
    color: "#fff",
    fontWeight: "bold",
    border: "none",
    borderRadius: "10px",
    cursor: "pointer",
    fontSize: "16px",
    transition: "0.3s",
  },
  forgotPassword: { textAlign: "right", fontSize: "12px" },
  loginLink: { marginTop: "15px", fontSize: "14px", color: "#555" },
};

export default Signin;
