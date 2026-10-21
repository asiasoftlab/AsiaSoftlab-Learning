import type { Metadata } from "next";
import { Inter as FontSans } from "next/font/google";
import "./globals.css";
import { PublicLayout } from "@/components/layout/PublicLayout";
import { AuthProvider } from "@/components/providers/AuthProvider";
import { Toaster } from "react-hot-toast";

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Asia Softlab Virtual Academy",
  description: "Professional Drone & Technology Training",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${fontSans.variable} h-full antialiased`} suppressHydrationWarning>
      <body className="min-h-full flex flex-col bg-slate-50" suppressHydrationWarning>
        <Toaster position="top-right" />
        <AuthProvider>
          <PublicLayout>{children}</PublicLayout>
        </AuthProvider>
      </body>
    </html>
  );
}
