"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback } from "react";
import { User } from "@heroui/user";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@heroui/dropdown";
import { addToast } from "@heroui/toast";
import { Skeleton } from "@heroui/skeleton";

import { pathNameConfig } from "@/config/site";
import useAuth from "@/api/hooks/use-auth";

function Logo() {
  return (
    <Link href={pathNameConfig.videos.url}>
      <svg
        className="mr-2"
        fill="none"
        height="24"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        viewBox="0 0 24 24"
        width="24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="12" cy="12" r="10" />
        <line x1="14.31" x2="20.05" y1="8" y2="17.94" />
        <line x1="9.69" x2="21.17" y1="8" y2="8" />
        <line x1="7.38" x2="13.12" y1="12" y2="2.06" />
        <line x1="9.69" x2="3.95" y1="16" y2="6.06" />
        <line x1="14.31" x2="2.83" y1="16" y2="16" />
        <line x1="16.62" x2="10.88" y1="12" y2="21.94" />
      </svg>
    </Link>
  );
}

const items = [
  {
    key: "profile",
    label: "Profile",
    url: pathNameConfig.profile.url,
  },
  {
    key: "point-history",
    label: "Point History",
    url: pathNameConfig.points.url,
  },
  {
    key: "wheel",
    label: "Wheel",
    url: pathNameConfig.wheels.url,
  },
  {
    key: "logout",
    label: "Logout",
  },
];

export default function Header() {
  const router = useRouter();
  const { user, logout, isLoading } = useAuth();

  const handlerLogout = useCallback(async () => {
    try {
      const res = await logout();

      if (!res || !res.ok) {
        const body = res ? await res.json().catch(() => null) : null;

        addToast({
          title: "Logout failed",
          description: body?.message || "Could not log out.",
          color: "danger",
        });

        return;
      }

      addToast({
        title: "Logged out",
        description: "You have been logged out.",
        color: "success",
      });

      router.push(pathNameConfig.login.url);
    } catch (error: any) {
      addToast({
        title: "Logout error",
        description: error?.message || "An error occurred.",
        color: "danger",
      });
    }
  }, [logout, router]);

  return (
    <header className="py-4 px-2">
      <div className="flex items-center justify-between gap-4">
        <Logo />

        {isLoading ? (
          <div className="flex items-center gap-4">
            <Skeleton className="w-10 h-10 rounded-full" />
            <div className="flex flex-col">
              <Skeleton className="h-4 w-24 mb-1" />
              <Skeleton className="h-3 w-32" />
            </div>
          </div>
        ) : user ? (
          <Dropdown backdrop="blur" placement="bottom-end">
            <DropdownTrigger>
              <User
                avatarProps={{
                  src: user?.avatar ?? "https://i.pravatar.cc/150?u=default",
                }}
                description={user?.email ?? ""}
                name={user?.name ?? "User"}
              />
            </DropdownTrigger>

            <DropdownMenu
              aria-label="Dynamic Actions"
              items={items}
              onAction={(key) => key === "logout" && handlerLogout()}
            >
              {(item) => (
                <DropdownItem
                  key={item.key}
                  className={item.key === "logout" ? "text-danger" : ""}
                  color={item.key === "logout" ? "danger" : "default"}
                  href={item.url}
                >
                  {item.label}
                </DropdownItem>
              )}
            </DropdownMenu>
          </Dropdown>
        ) : (
          <div className="flex items-center gap-4">
            <Link
              className="text-sm text-primary"
              href={pathNameConfig.login.url}
            >
              Login
            </Link>
            <Link className="text-sm" href={pathNameConfig.register.url}>
              Sign up
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
