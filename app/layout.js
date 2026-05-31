import "./globals.css";
import Navbar from "./components/Navbar";
import { headers } from "next/headers";

export const metadata = {
  title: "Custom Store",
  description: "Design your own merchandise",
};

export default async function RootLayout({ children }) {
  
  const headersList = await headers(); 
  const pathname = headersList.get("x-pathname") || "";

  const isAdmin = pathname.startsWith("/admin");

  return (
    <html lang="en">
      <body>
        {!isAdmin && <Navbar />}
        {children}
      </body>
    </html>
  );
}