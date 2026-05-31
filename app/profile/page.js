"use client";

import Link from "next/link";
import { useEffect, useMemo, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import { clearUser, getUserSnapshot, subscribeToUser } from "@/lib/user";
import styles from "./profile.module.css";

export default function Profile() {
  const router = useRouter();
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

  useEffect(() => {
    if (!user) {
      router.push("/login");
    }
  }, [router, user]);

  if (!user) return <p className={styles.loading}>Loading...</p>;

  const handleLogout = () => {
    clearUser();
    router.push("/");
  };

  return (
    <main className={styles.container}>
      <section className={styles.hero}>
        <div className={styles.heroTop}>
          <div className={styles.avatar}>
            <img src="/assets/profile.png" alt={`${user.name} profile`} />
          </div>
          <div className={styles.identity}>
            <p className={styles.eyebrow}>My Profile</p>
            <h1>{user.name}</h1>
            <p>{user.email}</p>
          </div>
        </div>

        <div className={styles.heroBottom}>
          <span className={styles.statusBadge}>Signed in</span>
          <button type="button" onClick={handleLogout} className={styles.logoutBtn}>
            Logout
          </button>
        </div>
      </section>

      <section className={styles.actions}>
        <Link href="/cart" className={styles.actionLink}>
          <div>
            <span>My Cart</span>
            <small>View products you added</small>
          </div>
          <strong>Open</strong>
        </Link>
      </section>

      <section className={styles.panel}>
        <div className={styles.panelHeader}>
          <p className={styles.eyebrow}>Account</p>
          <h2>Account Details</h2>
        </div>

        <div className={styles.detailRow}>
          <span>Name</span>
          <strong>{user.name}</strong>
        </div>
        <div className={styles.detailRow}>
          <span>Email</span>
          <strong>{user.email}</strong>
        </div>
        <div className={styles.detailRow}>
          <span>Account Status</span>
          <strong>Active</strong>
        </div>
      </section>
    </main>
  );
}
