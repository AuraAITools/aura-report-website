import { Notifications } from "@/components/notifications/Notifications";
import AuthProvider from "@/components/providers/AuthProvider";
import ReactQueryClientProvider from "@/components/providers/ReactQueryClientProvider";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Aura",
  description: "Manage your institution needs",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body className={inter.className}>
        <ReactQueryClientProvider>
          <AuthProvider>{children}</AuthProvider>
          <Notifications duration={4} />
        </ReactQueryClientProvider>
      </body>
    </html>
  );
}
