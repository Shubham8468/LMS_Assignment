import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { Toaster } from "react-hot-toast";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "LMS | Premium Loan Management",
  description: "Advanced Next-Gen Loan Management System",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-slate-950 text-slate-50 antialiased selection:bg-indigo-500/30`}>
        <AuthProvider>
          {children}
          <Toaster position="top-center" toastOptions={{
            style: {
              background: '#1e293b',
              color: '#f8fafc',
              border: '1px solid #334155'
            }
          }}/>
        </AuthProvider>
      </body>
    </html>
  );
}
