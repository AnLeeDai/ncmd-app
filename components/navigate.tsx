"use client";

import { Button } from "@heroui/button";
import { Card } from "@heroui/card";
import { usePathname } from "next/navigation";
import { Link } from "@heroui/link";
import { siteConfig } from "../config/site";

const NAV_ITEMS = siteConfig.navItems;

export default function Navigate() {
  const pathname = usePathname();

  return (
    <nav aria-label="Bottom navigation">
      <div className="mx-auto flex items-center justify-center">
        <Card
          isBlurred
          shadow="sm"
          className="flex flex-row items-center gap-4 px-3 py-2 rounded-full bg-background/60 dark:bg-default-100/50"
        >
          {NAV_ITEMS.map((item) => (
            <Button
              key={item.href + item.label}
              href={item.href}
              as={Link}
              radius="full"
              color={pathname === item.href ? "primary" : "default"}
              variant={pathname === item.href ? "solid" : "ghost"}
            >
              {item.label}
            </Button>
          ))}
        </Card>
      </div>
    </nav>
  );
}
