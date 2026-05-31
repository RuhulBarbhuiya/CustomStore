"use client";

import { useState } from "react";
import Link from "next/link";
import styles from "./signup.module.css";

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [otpRequired, setOtpRequired] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("error");

  const handleSignup = async () => {
    setMessage("");

    if (!name || !email || !password || (otpRequired && !otp)) {
      setMessageType("error");
      setMessage("Please fill all fields");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch("/api/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
          otp: otpRequired ? otp : undefined,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        if (data.otpRequired) {
          setOtpRequired(true);
          setMessageType("success");
          setMessage("OTP sent to your email");
          return;
        }

        setMessageType("success");
        setMessage("Signup successful! Redirecting to sign in...");
        window.location.href = "/login";
      } else {
        setMessageType("error");
        setMessage(data.error || "Unable to create account");
      }

    } catch (err) {
      setMessageType("error");
      setMessage("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
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
          onChange={(e) => {
            setName(e.target.value);
            setMessage("");
          }}
        />

        <input
          type="email"
          placeholder="Email Address"
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

        {otpRequired && (
          <input
            type="text"
            inputMode="numeric"
            maxLength={6}
            placeholder="Enter OTP from email"
            value={otp}
            onChange={(e) => {
              setOtp(e.target.value.replace(/\D/g, ""));
              setMessage("");
            }}
          />
        )}

        {message && (
          <div className={`${styles.message} ${styles[messageType]}`} role="alert">
            {message}
          </div>
        )}

        <button onClick={handleSignup} className={styles.button} disabled={loading}>
          {loading ? "PLEASE WAIT..." : otpRequired ? "VERIFY OTP" : "SIGN UP"}
        </button>

        <p>
          Already have an account?{" "}
          <Link href="/login">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
