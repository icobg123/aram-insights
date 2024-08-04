"use client";
import React from "react";
import Link from "next/link";
import Image from "next/legacy/image";
import logo from "@/public/logo.jpeg";
import { useSelectedLayoutSegment } from "next/navigation";

export const items = [
  {
    id: 1,
    title: "ARAM",
    href: "/",
    activeSegment: null,
  },
  {
    id: 2,
    title: "URF",
    href: "/ultra-rapid-fire",
    activeSegment: "ultra-rapid-fire",
  },
  {
    id: 3,
    title: "ARENA",
    href: "/arena",
    activeSegment: "arena",
  },
];

const Header = () => {
  const activeSegment = useSelectedLayoutSegment();

  return (
    <div className="navbar sticky top-0 z-10 mb-[-80px] bg-base-100 px-4">
      <div className="navbar-start space-x-2">
        <nav className="dropdown">
          <button
            tabIndex={0}
            aria-label="Open mobile menu"
            className="btn btn-ghost lg:hidden"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h8m-8 6h16"
              />
            </svg>
          </button>
          <ul
            tabIndex={0}
            className="menu dropdown-content menu-sm z-[999px] mt-3 w-52 rounded-box bg-base-100 p-2 shadow"
          >
            {items.map((item) => (
              <li key={item.id}>
                <Link
                  href={item.href}
                  className={
                    activeSegment === item.activeSegment
                      ? "btn-active"
                      : "text-muted-foreground"
                  }
                >
                  {item.title}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="avatar">
          <div className="rounded-full">
            <Image
              src={logo.src}
              width={40}
              height={40}
              alt="Aram Balance logo"
              placeholder="blur"
            />
          </div>
        </div>
        <a className="btn btn-ghost text-xl" href="/">
          Aram balance
        </a>
      </div>
      <nav className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1">
          {items.map((item) => (
            <li key={item.id}>
              <Link
                href={item.href}
                className={
                  activeSegment === item.activeSegment
                    ? "btn-active"
                    : "text-muted-foreground"
                }
              >
                {item.title}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <div className="navbar-end"></div>
    </div>
  );
};

export default Header;
