"use client";

import { useState } from "react";
import styles from "./contact.module.css";

export default function ContactPage() {
  const [sent, setSent] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();
    event.currentTarget.reset();
    setSent(true);
  };

  return (
    <main className={styles.container}>
      <section className={styles.hero}>
        <p>Contact</p>
        <h1>How can we help?</h1>
        <span>Questions about products, customization, cart, or checkout.</span>
      </section>

      <section className={styles.content}>
        <form className={styles.form} onSubmit={handleSubmit}>
          <input type="text" placeholder="Your name" required />
          <input type="email" placeholder="Email address" required />
          <textarea placeholder="Message" rows="5" required />
          <button type="submit">Send Message</button>
          {sent && <strong>Message sent successfully.</strong>}
        </form>

        <aside className={styles.info}>
          <h2>Store Support</h2>
          <p>support@customstore.com</p>
          <p>+91 98765 43210</p>
          <p>10 AM - 7 PM</p>
        </aside>
      </section>
    </main>
  );
}
