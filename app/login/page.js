"use client";

import { useState } from "react";
import Link from "next/link";
import styles from "./login.module.css";

const invalidCredentialMessage = "Invalid email or password";
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleLogin = async () => {
    setMessage("");

    if (!email || !password) {
      setMessage("Please fill all fields");
      return;
    }

    if (!emailPattern.test(email)) {
      setMessage(invalidCredentialMessage);
      return;
    }

    try {
      setLoading(true);
      const res = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("user", JSON.stringify(data.user));
        window.location.href = "/";
      } else {
        setMessage(data.error || invalidCredentialMessage);
      }

    } catch (err) {
      setMessage("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h2>Login To Continue Shopping</h2>

        <input
          type="email"
          placeholder="Enter your email address"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setMessage("");
          }}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            setMessage("");
          }}
        />

        {message && (
          <div className={styles.message} role="alert">
            {message}
          </div>
        )}

        <div className={styles.options}>
          <span>Forgot Password?</span>
        </div>

        <button onClick={handleLogin} className={styles.button} disabled={loading}>
          {loading ? "PLEASE WAIT..." : "SIGN IN"}
        </button>

        <p>
          Dont have an account yet?{" "}
          <Link href="/signup">Sign-up</Link>
        </p>
      </div>
    </div>
  );
}
