import React, { useState } from "react";
import axios from "axios"; // Install axios: npm install axios
import { useNavigate } from "react-router-dom";

const Signup: React.FC = () => {
    const navigate = useNavigate(); // ✅ Initialize navigate

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    contactNumber: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };  

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post(
        "http://localhost:5000/api/users/signup",
        form,
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      alert(response.data.message);
      console.log(response.data.user);
 // ✅ Clear form fields
      setForm({ fullName: "", email: "", contactNumber: "", password: "" });

      // ✅ Redirect to Signin page
      navigate("/signin");    } catch (error: any) {
      if (error.response) {
        alert(error.response.data.message);
      } else {
        alert("Something went wrong!");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h1 style={styles.title}>Create Account</h1>
        <p style={styles.subtitle}>Join us and get started!</p>
        <form onSubmit={handleSubmit} style={styles.form}>
          <label style={styles.label}>
            Full Name
            <input
              style={styles.input}
              type="text"
              name="fullName"
              value={form.fullName}
              onChange={handleChange}
              required
              placeholder="John Doe"
            />
          </label>

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
            Contact Number
            <input
              style={styles.input}
              type="tel"
              name="contactNumber"
              value={form.contactNumber}
              onChange={handleChange}
              required
              placeholder="+91 9876543210"
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

          <button type="submit" style={styles.submitBtn} disabled={loading}>
            {loading ? "Signing Up..." : "Sign Up"}
          </button>
        </form>
        <p style={styles.loginLink}>
          Already have an account? <a href="/signin">Login</a>
        </p>
      </div>
    </div>
  );
};

// Keep your styles unchanged
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
  loginLink: { marginTop: "15px", fontSize: "14px", color: "#555" },
};

export default Signup;
