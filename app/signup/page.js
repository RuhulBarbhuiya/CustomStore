"use client";

import { useState } from "react";
import Link from "next/link";
import styles from "./signup.module.css";

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignup = async () => {
    try {
      const res = await fetch("/api/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }), // send signup data
      });

      const data = await res.json();
      console.log(data);

      if (res.ok) {
        alert("Signup successful!"); 
      } else {
        alert(data.error);
      }

    } catch (err) {
      console.log(err);
      alert("Something went wrong"); // error handling
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h2>Create Your Account</h2>

        <input
          type="text"
          placeholder="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          type="email"
          placeholder="Email Address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button onClick={handleSignup} className={styles.button}>
          SIGN UP
        </button>

        <p>
          Already have an account?{" "}
          <Link href="/login">Sign in</Link>
        </p>
      </div>
    </div>
  );
}