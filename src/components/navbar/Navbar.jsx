"use client";
import React, { useState } from 'react';
import Dropdowns from './Dropdowns';
import { FaFacebook, FaLinkedin, FaWhatsapp } from 'react-icons/fa';
import { SiGmail } from "react-icons/si";
import { CiMenuFries } from "react-icons/ci";
import { IoCodeDownload } from 'react-icons/io5';
import SidePanel from './SidePanel';
import Link from 'next/link';
import Search from './Search';
import Logo from './Logo';

const Navbar = () => {
    const [sideMenu, setSideMenu] = useState(false);
    const [scrollY, setScrollY] = useState(false);
    
    return (
        <nav className={`sticky top-0 transition-all duration-1000 z-[9999] bg-base-200`}>
            <div className='py-2 font-bold container mx-auto flex justify-between items-center'>
                <div>
                <Link href='/' onClick={() => window.scrollTo(0, 0)} className='flex items-end'>
                    <Logo/>
                </Link>
                </div>
                <div>            
                <Search/>
                </div>
                <div className='hidden lg:block'>
                    <ul className='flex gap-2 xl:gap-6 menu-list text-sm xl:text-[16px]'>
                        <li onClick={() => window.scrollTo(0, 0)}><Link href='/'>Home</Link></li>
                        <li><a href="/#about">Jobs</a></li>
                        <Dropdowns />
                        <li><a href="/advice">Advice</a></li>                        
                    </ul>
                </div>
                <div className='hidden md:flex items-center gap-3 social-area mx-3'>                    
                    <a href='#' target='_blank' className='inline-flex items-center gap-2 cursor-pointer text-md border py-1 px-4 rounded-lg text-primary transition-all duration-1000 hover:bg-black hover:text-white'>
                        Login
                    </a>
                    <a href='#' target='_blank' className='inline-flex items-center gap-2 cursor-pointer text-md border py-1 px-4 rounded-lg text-white bg-primary transition-all duration-1000 hover:bg-black hover:text-white'>
                        Signup
                    </a>
                </div>
                <div className='social-area lg:hidden'>
                    <button onClick={() => setSideMenu(!sideMenu)} className='p-1 rounded-sm border border-primary hover:border-secondary text-primary hover:text-secondary'>
                        <CiMenuFries id='menu-icon' className='social-icon rounded-sm w-5 h-5'/>                        
                    </button>
                </div>
                <SidePanel sideMenu={sideMenu} setSideMenu={setSideMenu} />
            </div>
            {/* {sideMenu && <SidePanel1 sideMenu = {sideMenu} setSideMenu={setSideMenu}/>} */}
        </nav>
    );
};

export default Navbar;