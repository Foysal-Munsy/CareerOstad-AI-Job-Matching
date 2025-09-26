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
          <div className="block sm:hidden">
                              <h1 className="text-xl font-bold text-primary">CareerOstad</h1>
                              <p className="text-[9px] text-gray-500 text-muted-foreground -mt-1 font-light">AI-Powered Career Guidance</p>
                          </div>
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
              
        {/* Dashboard-related collapses removed for a cleaner public navbar */}
        <li className="px-5 py-2.5" onClick={() => setSideMenu(!sideMenu)}>
          <Link href="/advice" className="">
            Carrier Advice
          </Link>
        </li>
        <details className="collapse collapse-plus">
                    <summary className="collapse-title font-bold">Profile</summary>
                    <div className="collapse-content text-sm">
                        <ul onClick={() => setSideMenu(!sideMenu)}>
                            <li className='sub-menu-list px-5 py-2.5'><Link href="/dashboard">Dashboard <span className='hidden go-icon'>&gt;</span></Link></li>
                            <li className='sub-menu-list px-5 py-2.5'><a href="#">Route-2 <span className='hidden go-icon'>&gt;</span></a></li>
                            <li className='sub-menu-list px-5 py-2.5'><a href="#">Route-3 <span className='hidden go-icon'>&gt;</span></a></li>
                        </ul>
                    </div>
                </details>
        {/* <Dropdowns sideMenu={sideMenu} setSideMenu={setSideMenu} /> */}
        {
          status === 'authenticated' ?
            <div onClick={() => setSideMenu(!sideMenu)} className="md:hidden flex items-center gap-3 social-area mx-4">
              <span
                className="inline-flex items-center gap-2 text-md text-primary transition-all duration-1000"
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
            <div onClick={() => setSideMenu(!sideMenu)} className=" md:hidden flex items-center gap-3 social-area mx-5">
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