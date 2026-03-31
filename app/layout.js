import "./globals.css";
import Navbar from "./components/Navbar";

export const metadata = {
  title: "Custom Store",
  description: "Design your own merchandise",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>

        <Navbar />   {}

        {children}

      </body>
    </html>
  );
}