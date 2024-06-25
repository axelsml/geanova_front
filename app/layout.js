"use client";

import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import { LoadingProvider } from "@/contexts/loading";
import { Backdrop } from "@mui/material";
import BackgroundTask from "./api/background/background";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="description" content="Proyecto Geanova" />
        <title>Geanova | Sistema</title>
      </head>
      <body className={inter.className}>
        <LoadingProvider>
          <Header />
          {children}
          <BackgroundTask />
        </LoadingProvider>
      </body>
    </html>
  );
}
