"use client";
import React, { useState } from "react";
import Dropdowns from "./Dropdowns";
import { CiMenuFries } from "react-icons/ci";
import SidePanel from "./SidePanel";
import Link from "next/link";
import Search from "./Search";
import Logo from "./Logo";
import { signOut, useSession } from "next-auth/react";

const Navbar = () => {
  const [sideMenu, setSideMenu] = useState(false);
  const [scrollY, setScrollY] = useState(false);

  const { data: session, status } = useSession();
  //console.log(session, status);

  return (
    <nav>
      <div className="py-2 font-bold container mx-auto flex justify-between items-center px-2 sm:px-0">
        <div>
          <Link
            href="/"
            onClick={() => window.scrollTo(0, 0)}
            className="flex items-end"
          >
            <Logo />
          </Link>
        </div>
        <div>
          <Search />
        </div>
        <div className="hidden lg:block">
          <ul className="flex gap-2 xl:gap-6 menu-list text-sm xl:text-[16px] text-base-content">
            <li onClick={() => window.scrollTo(0, 0)}>
              <Link href="/">Home</Link>
            </li>
            <li>
              <a href="/#about">Jobs</a>
            </li>
            <Dropdowns />
            <li>
              <Link href="/advice">Advice</Link>
            </li>
          </ul>
        </div>

        {
          status === 'authenticated'?
          <div className="hidden md:flex items-center gap-3 social-area mx-3">
          <span
            className="inline-flex items-center gap-2 text-md text-primary transition-all duration-1000"
          >
            {session?.user?.name}
          </span>
          <button
            onClick={() => signOut()}
            className="inline-flex items-center gap-2 cursor-pointer text-md border py-1 px-4 rounded-btn bg-primary text-primary-content transition-all duration-1000 hover:bg-primary/90"
          >
            Logout
          </button>
        </div>
          :
          <div className="hidden md:flex items-center gap-3 social-area mx-3">
          <Link
            href="/login"
            className="inline-flex items-center gap-2 cursor-pointer text-md border py-1 px-4 rounded-btn border-primary text-primary transition-all duration-1000 hover:bg-primary hover:text-primary-content"
          >
            Login
          </Link>
          <Link
            href="/signup"
            className="inline-flex items-center gap-2 cursor-pointer text-md border py-1 px-4 rounded-btn bg-primary text-primary-content transition-all duration-1000 hover:bg-primary/90"
          >
            Signup
          </Link>
        </div>
        }        
        <div className="social-area lg:hidden">
          <button
            onClick={() => setSideMenu(!sideMenu)}
            className="p-1 rounded-sm border border-primary text-primary"
          >
            <CiMenuFries
              id="menu-icon"
              className="social-icon rounded-sm w-5 h-5"
            />
          </button>
        </div>
        <SidePanel sideMenu={sideMenu} setSideMenu={setSideMenu} />
      </div>
    </nav>
  );
};

export default Navbar;
