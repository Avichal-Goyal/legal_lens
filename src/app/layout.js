"use client"
import "./globals.css";
import NavbarPage from "@/components/Navbar.jsx";
import Navbar2 from "@/components/navbar2";
// import NavbarForFeatures from "@/components/NavbarForFeatures";
import React from "react";
import { usePathname } from "next/navigation";


export default function RootLayout({ children }) {
  const pathname = usePathname();
  const showNavbarForUserSetup = pathname === "/login" || pathname === "/signup";
  const showNavbarForFeatures = pathname === "/consultant" || pathname ==="/analysisResult";
  return (
    <html lang="en">
      {!showNavbarForFeatures && <body className="min-h-screen bg-black">
        {showNavbarForUserSetup && <Navbar2 />}
        {!showNavbarForUserSetup && <NavbarPage />}
        <main className="pt-16">{children}</main>
        <footer className="bg-black text-white py-4">
          <div className="container mx-auto text-center">
            <p>&copy; {new Date().getFullYear()} Legal Lens. All rights reserved.</p>
          </div>
        </footer>
      </body>}
      {showNavbarForFeatures && <body className="min-h-screen bg-gray-100">
        {/* <NavbarForFeatures /> */}
        <main>{children}</main>
      </body>}
    </html>
  )
}