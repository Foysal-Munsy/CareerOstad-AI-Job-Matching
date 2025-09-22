import React from "react";
import Dropdowns from "./Dropdowns";
import { CgClose } from "react-icons/cg";
import Link from "next/link";
import Logo from "./Logo";

const SidePanelContent = ({ sideMenu, setSideMenu }) => {
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
        <div className="md:hidden">
          <Link
            href="/login"
            className="inline-flex text-sm items-center cursor-pointer border px-4 py-1 rounded-lg transition-all duration-1000 mx-4 w-fit justify-center"
          >
            Login
          </Link>
          <Link
            href="/signup"
            className="inline-flex text-sm items-center bg-primary text-white cursor-pointer px-4 py-1 rounded-lg transition-all duration-1000 w-fit justify-center"
          >
            Signup
          </Link>
        </div>
      </ul>
    </>
  );
};

export default SidePanelContent;
