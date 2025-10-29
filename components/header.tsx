"use client";

import { User } from "@heroui/user";
import Link from "next/link";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@heroui/dropdown";

import { pathNameConfig } from "@/config/site";

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
  const handlerLogout = () => {};

  return (
    <header className="py-4 px-2">
      <div className="flex items-center justify-between gap-4">
        <Logo />

        <Dropdown backdrop="blur" placement="bottom-end">
          <DropdownTrigger>
            <User
              avatarProps={{
                src: "https://i.pravatar.cc/150?u=a04258114e29026702d",
              }}
              description="Product Designer"
              name="Jane Doe"
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
      </div>
    </header>
  );
}
