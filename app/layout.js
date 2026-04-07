import "./globals.css";
import Navbar from "./components/Navbar";

// 👇 IMPORTANT
import { headers } from "next/headers";

export const metadata = {
  title: "Custom Store",
  description: "Design your own merchandise",
};

export default function RootLayout({ children }) {
  // get current path
  const pathname = headers().get("x-pathname") || "";

  const isAdmin = pathname.startsWith("/admin");

  return (
    <html lang="en">
      <body>
        {/* Hide navbar on admin pages */}
        {!isAdmin && <Navbar />}

        {children}
      </body>
    </html>
  );
}