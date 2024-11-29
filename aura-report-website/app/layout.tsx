import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Theme, ThemePanel } from "@radix-ui/themes";
import AuthProvider from "@/components/providers/AuthProvider";
import { Notifications } from "@/components/notifications/notifications";

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
    <html lang="en">
      <body className={inter.className}>
        <Theme
          accentColor="orange"
          grayColor="slate"
          panelBackground="translucent"
          radius="large"
          scaling="95%"
        >
          <AuthProvider>{children}</AuthProvider>
          <Notifications duration={4}/>
          {/* <ThemePanel /> */}
        </Theme>
      </body>
    </html>
  );
}
