"use client"
import "./globals.css";
import NavbarPage from "@/components/Navbar.jsx";
import Navbar2 from "@/components/navbar2";
// import NavbarForFeatures from "@/components/NavbarForFeatures";
import React from "react";
import { usePathname } from "next/navigation";
import { Toaster } from "sonner";


export default function RootLayout({ children }) {
  const pathname = usePathname();
  const showNavbarForUserSetup = pathname === "/userSetup/sign-in" || pathname === "/userSetup/sign-up";
  const showNavbarForFeatures = pathname === "/consultant" || pathname ==="/analysisResult" || pathname === "/testAnalyze" || pathname === "/testAnalyze2";
  const dontShowNavbar = pathname === "/" || pathname === "/fileText"
  
  return (
    <html lang="en">
      {dontShowNavbar && <body>
        <main className="">{children}</main>
        <Toaster position="top-right" richColors />
      </body>}
      {!showNavbarForFeatures && !dontShowNavbar && <body className="min-h-screen bg-black">
        {showNavbarForUserSetup && <Navbar2 />}
        {!showNavbarForUserSetup && <NavbarPage />}
        <main className="pt-16">{children}</main>
        <footer className="bg-black text-white py-4">
          <div className="container mx-auto text-center">
            <p>&copy; {new Date().getFullYear()} Legal Lens. All rights reserved.</p>
          </div>
        </footer>
        <Toaster position="top-right" richColors />
      </body>}
      {showNavbarForFeatures && <body className="min-h-screen bg-gray-100">
        {/* <NavbarForFeatures /> */}
        <main>{children}</main>
        <Toaster position="top-right" richColors />
      </body>}
    </html>
  )
}