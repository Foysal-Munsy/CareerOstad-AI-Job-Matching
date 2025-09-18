import React from 'react';
import { CgClose } from 'react-icons/cg';
import SidePanelContent from './SidePanelContent';

const SidePanel = ({ sideMenu, setSideMenu }) => {
    return (
        <>
            <div onClick={() => setSideMenu(!sideMenu)} className={`lg:hidden fixed z-50 top-0 right-0 transition-all duration-1000 ${sideMenu ? '' : 'hidden'} text-white bg-black opacity-85 p-4 w-full h-screen cursor-no-drop`}>
                <div className='cursor-pointer text-5xl relative left-[85%]'>
                    <CgClose/>
                </div>
            </div>
            <div className={`lg:hidden fixed top-0 transition-all z-10000 duration-500 ${sideMenu ? '-left-0' : '-left-200'} text-primary bg-secondary p-4 w-2/3 h-screen overflow-y-scroll `}>
                <div>
                    <SidePanelContent sideMenu={sideMenu} setSideMenu={setSideMenu} />
                </div>
            </div>
        </>
    );
};
export default SidePanel;