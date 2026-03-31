"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./profile.module.css";

export default function Profile() {
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (!storedUser) {
      router.push("/login");
    } else {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  if (!user) return <p>Loading...</p>;

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Profile</h1>

      {/* TOP CARD */}
      <div className={styles.card}>
        <div className={styles.profileTop}>
          <div className={styles.avatar}>
            {user.name.charAt(0).toUpperCase()}
          </div>

      
        </div>
      </div>

      {/* DETAILS CARD */}
      <div className={styles.card}>
        <h3>Account Details</h3>

        <div className={styles.grid}>
          <div>
            <p className={styles.label}>Full Name</p>
            <p>{user.name}</p>
          </div>

          <div>
            <p className={styles.label}>Email</p>
            <p>{user.email}</p>
          </div>

        </div>

        <button
          className={styles.logout}
          onClick={() => {
            localStorage.removeItem("user");
            router.push("/");
          }}
        >
          Logout
        </button>
      </div>
    </div>
  );
}