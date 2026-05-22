import type { Metadata } from "next";
import Navigation from "@/components/Navigation";
import "./globals.css";

export const metadata: Metadata = {
  title: "Gestion locative",
  description: "Application de gestion locative",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body>
        <div className="app">
          <Navigation />
          <main className="main">{children}</main>
        </div>
      </body>
    </html>
  );
}
