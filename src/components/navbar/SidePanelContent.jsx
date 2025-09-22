import React from "react";
import Dropdowns from "./Dropdowns";
import { CgClose } from "react-icons/cg";
import Link from "next/link";
import Logo from "./Logo";
import { signOut, useSession } from "next-auth/react";



const SidePanelContent = ({ sideMenu, setSideMenu }) => {
  const { data: session, status } = useSession();
  return (
    <>
      <div className="flex justify-between border-b pb-4 -mx-4 mb-4">
        <Link
          href="/"
          onClick={() => {
            window.scrollTo(0, 0);
            setSideMenu(!sideMenu);
          }}
          className="flex items-end mx-4"
        >
          <Logo />
        </Link>
        <button
          onClick={() => setSideMenu(!sideMenu)}
          className="mx-6 cursor-pointer"
        >
          <CgClose />
        </button>
      </div>
      <ul className="border-b pb-4 -mx-4 flex flex-col gap-2 menu-list text-lg justify-center">
        <li
          className="px-5 py-2.5"
          onClick={() => {
            window.scrollTo(0, 0);
            setSideMenu(!sideMenu);
          }}
        >
          <Link href="/">Home</Link>
        </li>
        <li className="px-5 py-2.5" onClick={() => setSideMenu(!sideMenu)}>
          <a href="/#about" className="">
            Jobs
          </a>
        </li>
        <details className="collapse collapse-plus">
          <summary className="collapse-title font-bold">Candidates</summary>
          <div className="collapse-content text-sm">
            <ul onClick={() => setSideMenu(!sideMenu)}>
              <li className="sub-menu-list px-5 py-2.5">
                <a href="#">
                  Candidate Dashboard
                  <span className="hidden go-icon">&gt;</span>
                </a>
              </li>
              <li className="sub-menu-list px-5 py-2.5">
                <a href="#">
                  Match Your Skill<span className="hidden go-icon">&gt;</span>
                </a>
              </li>
              <li className="sub-menu-list px-5 py-2.5">
                <a href="#">
                  Apply For Job<span className="hidden go-icon">&gt;</span>
                </a>
              </li>
            </ul>
          </div>
        </details>
        <details className="collapse collapse-plus">
          <summary className="collapse-title font-bold">Companies</summary>
          <div className="collapse-content text-sm">
            <ul>
              <li className="sub-menu-list px-5 py-2.5">
                <a href="#">
                  Company Dashboard<span className="hidden go-icon">&gt;</span>
                </a>
              </li>
              <li className="sub-menu-list px-5 py-2.5">
                <a href="#">
                  Match Candidate<span className="hidden go-icon">&gt;</span>
                </a>
              </li>
              <li className="sub-menu-list px-5 py-2.5">
                <a href="#">
                  Post Job<span className="hidden go-icon">&gt;</span>
                </a>
              </li>
            </ul>
          </div>
        </details>
        <li className="px-5 py-2.5" onClick={() => setSideMenu(!sideMenu)}>
          <Link href="/advice" className="">
            Carrier Advice
          </Link>
        </li>
        {/* <Dropdowns sideMenu={sideMenu} setSideMenu={setSideMenu} /> */}
        {
          status === 'authenticated' ?
            <div className="md:hidden flex items-center gap-3 social-area mx-4">
              <span
                className="inline-flex items-center gap-2 cursor-pointer text-md text-primary transition-all duration-1000 hover:bg-primary"
              >
                {session?.user?.name}
              </span>
              <button
                onClick={() => signOut()}
                target="_blank"
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
      </ul>
    </>
  );
};

export default SidePanelContent;
