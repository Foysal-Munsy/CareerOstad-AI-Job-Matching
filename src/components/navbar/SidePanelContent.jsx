import React from 'react';
import Dropdowns from './Dropdowns';
import { CgClose } from 'react-icons/cg';
import Link from 'next/link';

const SidePanelContent = ({ sideMenu, setSideMenu }) => {
    return (
        <>
            <div className='flex justify-between border-b pb-4 -mx-4 mb-4'>
                <Link href='/' onClick={() => { window.scrollTo(0, 0); setSideMenu(!sideMenu) }} className='flex items-end mx-6'>
                    <figure className='w-10'>
                        <img className='relative right-2' alt="N" />
                    </figure>
                    <figcaption className='-ml-3 text-xl logo-text'>CarrierOstad</figcaption>
                </Link>
                <button onClick={() => setSideMenu(!sideMenu)} className='mx-6 cursor-pointer'><CgClose /></button>
            </div>
            <ul className='border-b pb-4 -mx-4 flex flex-col gap-2 menu-list text-lg justify-center'>
                <li className='px-5 py-2.5' onClick={() => { window.scrollTo(0, 0); setSideMenu(!sideMenu) }}><Link href='/'>Home</Link></li>
                <li className='px-5 py-2.5' onClick={() => setSideMenu(!sideMenu)}><a href="/#about" className=''>Jobs</a></li>
                <li className='px-5 py-2.5' onClick={() => setSideMenu(!sideMenu)}><a href="/#skill">Skills</a></li>
                <details className="collapse collapse-plus">
                    <summary className="collapse-title font-bold">Candidates</summary>
                    <div className="collapse-content text-sm">
                        <ul onClick={() => setSideMenu(!sideMenu)}>
                            <li className='sub-menu-list px-5 py-2.5'><a href="#">Route-1 <span className='hidden go-icon'>&gt;</span></a></li>
                            <li className='sub-menu-list px-5 py-2.5'><a href="#">Route-2 <span className='hidden go-icon'>&gt;</span></a></li>
                            <li className='sub-menu-list px-5 py-2.5'><a href="#">Route-3 <span className='hidden go-icon'>&gt;</span></a></li>
                        </ul>
                    </div>
                </details>
                <details className="collapse collapse-plus">
                    <summary className="collapse-title font-bold">Companies</summary>
                    <div className="collapse-content text-sm">
                        <ul>
                            <li className='sub-menu-list px-5 py-2.5'><a href="#">Route-1 <span className='hidden go-icon'>&gt;</span></a></li>
                            <li className='sub-menu-list px-5 py-2.5'><a href="#">Route-2 <span className='hidden go-icon'>&gt;</span></a></li>
                            <li className='sub-menu-list px-5 py-2.5'><a href="#">Route-3 <span className='hidden go-icon'>&gt;</span></a></li>
                        </ul>
                    </div>
                </details>                
                {/* <Dropdowns sideMenu={sideMenu} setSideMenu={setSideMenu} /> */}
                <div className='md:hidden'>
                    <Link href='/' className='inline-flex text-sm items-center cursor-pointer border px-4 rounded-lg transition-all duration-1000 mx-4 w-fit justify-center'>
                    Login
                </Link>
                <Link href='/' className='inline-flex text-sm items-center cursor-pointer border px-4 rounded-lg transition-all duration-1000 w-fit justify-center'>
                    Signup
                </Link>
                </div>
            </ul>
        </>
    );
};

export default SidePanelContent;