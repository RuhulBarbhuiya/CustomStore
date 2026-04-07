"use client";

import { useState } from "react";
import Link from "next/link";
import styles from "./login.module.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    if (!email || !password) {
      alert("Please fill all fields");
      return;
    }

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("user", JSON.stringify(data.user));
        window.location.href = "/";
      } else {
        alert(data.error);
      }

    } catch (err) {
      alert("Something went wrong");
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
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <div className={styles.options}>
          <span>Forgot Password?</span>
        </div>

        <button onClick={handleLogin} className={styles.button}>
          SIGN IN
        </button>

        <p>
          Dont have an account yet?{" "}
          <Link href="/signup">Sign-up</Link>
        </p>
      </div>
    </div>
  );
}