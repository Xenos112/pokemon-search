"use client";
import React, { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { Menu, X } from "lucide-react";

const NAV_LINK = [
  {
    name: "Home",
    href: "/",
  },
  {
    name: "Details",
    href: "/details/1",
  },
  {
    name: "Stats",
    href: "/stats",
  },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const path = usePathname();
  const router = useRouter();

  const handleClick = (path: string) => {
    setOpen((prev) => false);
    router.push(path);
  };

  return (
    <header className="fixed w-full backdrop-blur bg-black/40 z-50">
      <nav className="sticky container mx-auto h-[80px] flex items-center justify-between px-4">
        <Link href={"/"} className="text-2xl font-semibold text-white">
          Pokemon
        </Link>
        <ul
          className={`flex gap-5 text-white max-md:fixed max-md:top-0 max-md:left-0 max-md:bg-black/90 max-md:backdrop-blur-lg max-md:w-screen max-md:flex-col max-md:items-center max-md:justify-center max-md:text-2xl max-md:gap-10 max-md:h-screen ${
            open || "max-md:hidden"
          }`}
        >
          {NAV_LINK.map((link) => (
            <li key={link.href}>
              <button onClick={() => handleClick(link.href)}>
                {link.name}
              </button>
            </li>
          ))}
          <button
            className="cursor-pointer max-md:block hidden absolute left-5 top-5"
            onClick={() => setOpen((prev) => !prev)}
          >
            <X color="white" />
          </button>
        </ul>
        <button
          className="cursor-pointer max-md:block hidden"
          onClick={() => setOpen((prev) => !prev)}
        >
          <Menu color="white" />
        </button>
      </nav>
    </header>
  );
}
