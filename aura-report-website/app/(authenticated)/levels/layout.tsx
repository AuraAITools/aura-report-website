"use client";
import Authorization from "@/components/providers/Authorization";
import { PropsWithChildren } from "react";

export default function Layout({ children }: PropsWithChildren) {
  return (
    <Authorization allowedRoles={["institution-admin"]}>
      {children}
    </Authorization>
  );
}
