import "./globals.css";
import NavbarPage from "./navbar";


export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-black">
        <NavbarPage />
        <main className="pt-16">{children}</main>
      </body>
    </html>
  )
}