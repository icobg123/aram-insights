import React from "react";
import Link from "next/link";
import Image from "next/legacy/image";
import logo from "@/public/logo.jpeg";

const Header = () => {
  return (
    <div className="navbar sticky top-0 mb-[-80px] bg-base-100 px-4">
      <div className="navbar-start space-x-2">
        <div className="avatar">
          <div className="rounded-full">
            <Image
              src={logo}
              width={64}
              height={64}
              alt="Aram Balance logo"
              placeholder="blur"
              blurDataURL="/transperant-placeholder.png"
            />
          </div>
        </div>
        <a className="btn btn-ghost text-xl">Aram balance</a>
      </div>
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1">
          <li>
            <Link href={"/"}>ARAM</Link>
          </li>
          <li>
            <Link href={"/ultra-rapid-fire"}>URF</Link>
          </li>
          <li>
            <Link href={"/arena"}>ARENA</Link>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Header;
