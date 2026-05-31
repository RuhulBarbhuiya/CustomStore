"use client";

import Link from "next/link";
import { useMemo, useSyncExternalStore } from "react";
import { usePathname } from "next/navigation";
import { getUserSnapshot, subscribeToUser } from "@/lib/user";
import styles from "../page.module.css";

export default function Navbar() {
  const pathname = usePathname();
  const userSnapshot = useSyncExternalStore(
    subscribeToUser,
    getUserSnapshot,
    () => "null"
  );

  const user = useMemo(() => {
    try {
      return JSON.parse(userSnapshot);
    } catch {
      return null;
    }
  }, [userSnapshot]);

  if (pathname.startsWith("/admin")) {
    return null;
  }

  return (
    <nav className={styles.navbar}>
      <Link href="/" className={styles.logoContainer}>
        <img src="/homepage/C.png" className={styles.logoImg} alt="Custom Store" />
        <span className={styles.logoText}>Custom Store</span>
      </Link>

      <ul className={styles.navLinks}>
        <li><Link href="/">HOME</Link></li>
        <li className={styles.navDropdown}>
          <Link href="/tshirts">CATEGORIES</Link>
          <div className={styles.dropdownMenu}>
            <Link href="/tshirts">T-shirts</Link>
            <Link href="/hoodies">Hoodies</Link>
            <Link href="/full-sleeves">Full Sleeves</Link>
            <Link href="/mugs">Mugs</Link>
            <Link href="/caps">Caps</Link>
          </div>
        </li>
        <li className={styles.navDropdown}>
          <Link href="/customize/tshirts">CUSTOMIZE</Link>
          <div className={styles.dropdownMenu}>
            <Link href="/customize/tshirts">T-shirts</Link>
            <Link href="/customize/hoodies">Hoodies</Link>
            <Link href="/customize/full-sleeves">Full Sleeves</Link>
            <Link href="/customize/mugs">Mugs</Link>
            <Link href="/customize/caps">Caps</Link>
          </div>
        </li>
        <li><Link href="/cart">CART</Link></li>
        <li><Link href="/contact">CONTACT</Link></li>
        <li><Link href="/about">ABOUT US</Link></li>
      </ul>

      {user ? (
        <Link href="/profile" className={styles.profileLink}>
          <span className={styles.profileIcon} aria-hidden="true">
            <svg viewBox="0 0 24 24" role="img">
              <path d="M12 12c2.2 0 4-1.8 4-4s-1.8-4-4-4-4 1.8-4 4 1.8 4 4 4Zm0 2c-3.3 0-6 2.1-6 4.7 0 .7.6 1.3 1.3 1.3h9.4c.7 0 1.3-.6 1.3-1.3 0-2.6-2.7-4.7-6-4.7Z" />
            </svg>
          </span>
          Profile
        </Link>
      ) : (
        <Link href="/login">
          <button className={styles.signIn}>Sign In</button>
        </Link>
      )}
    </nav>
  );
}
