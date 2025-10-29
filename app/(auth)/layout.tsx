"use client";

import { Card, CardHeader } from "@heroui/card";
import { usePathname } from "next/navigation";

interface AuthLayoutProps {
  children: React.ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  const pathname = usePathname();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen mx-auto max-w-7xl pb-4">
      <Card className="w-[350px] mx-auto">
        <CardHeader>
          <h1 className="text-center w-full text-lg font-semibold">
            {pathname?.includes("login") ? "Welcome Back" : "Create an Account"}
          </h1>
        </CardHeader>

        {children}
      </Card>
    </div>
  );
}
