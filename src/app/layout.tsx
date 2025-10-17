import "./globals.css";
import Header from "./shared/Header";
import Footer from "./shared/Footer";
import { ThemeProvider } from "./shared/Theme";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Tabs Generator", description: "Assignment 1 MVP" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider>
          <Header />
          <main style={{ minHeight: "70vh", padding: "1rem", maxWidth: 960, margin: "0 auto" }}>{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
