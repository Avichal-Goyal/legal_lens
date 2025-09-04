"use client"
import "./globals.css";
import NavbarPage from "./navbar";
import Navbar2 from "@/components/navbar2";
import React from "react";
import { usePathname } from "next/navigation";


export default function RootLayout({ children }) {
  const pathname = usePathname();
  const showNavbar = pathname !== "/login" && pathname !== "/signup";
  return (
    <html lang="en">
      <body className="min-h-screen bg-black">
        {showNavbar && <NavbarPage />}
        {!showNavbar && <Navbar2 />}
        <main className="pt-16">{children}</main>
      </body>
    </html>
  )
}