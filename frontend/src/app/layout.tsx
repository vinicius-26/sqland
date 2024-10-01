import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./assets/styles/global.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SQLand",
  icons: {
    icon: "./assets/images/sql.ico"
  }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-br">
      <head>
      <link rel="icon" href="./assets/images/icon.ico" type="image/x-icon" />
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  );
}