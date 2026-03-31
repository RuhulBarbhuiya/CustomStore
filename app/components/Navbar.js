"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import styles from "../page.module.css";

export default function Navbar() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  return (
    <nav className={styles.navbar}>

      <Link href="/" className={styles.logoContainer}>
        <img src="/homepage/C.png" className={styles.logoImg} />
        <span className={styles.logoText}>Custom Store</span>
      </Link>

      <ul className={styles.navLinks}>
        <li><Link href="/">HOME</Link></li>
        <li><Link href="/tshirts">T-SHIRTS</Link></li>
        <li>MUGS</li>
        <li>HOODIES</li>
        <li>CONTACT</li>
        <li>ABOUT US</li>
      </ul>

      {}
{user ? (
  <Link href="/profile" className={styles.profileLink}>
    👤 Profile
  </Link>
) : (
  <Link href="/login">
    <button className={styles.signIn}>Sign In</button>
  </Link>
)}
    </nav>
  );
}