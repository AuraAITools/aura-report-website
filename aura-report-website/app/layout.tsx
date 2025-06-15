import { Notifications } from "@/components/notifications/notifications";
import AuthProvider from "@/components/providers/AuthProvider";
import ReactQueryClientProvider from "@/components/providers/ReactQueryClientProvider";
import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import "./globals.css";
import { twMerge } from "tailwind-merge";
const dmSans = DM_Sans({ subsets: ["latin"] });

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
      <body className={twMerge(dmSans.className, "antialiased bg-[#EAEEFE]")}>
        <ReactQueryClientProvider>
          <AuthProvider>{children}</AuthProvider>
          <Notifications duration={4} />
        </ReactQueryClientProvider>
      </body>
    </html>
  );
}
