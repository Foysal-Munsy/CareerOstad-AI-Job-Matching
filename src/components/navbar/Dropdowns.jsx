import React from 'react';
const menus = [
    {
        label: 'Candidates',
        items: [
            { label: 'Route-1', href: '/#projects' },
            { label: 'Route-2', href: '/projects' },
            { label: 'Route-3', href: '/projects' },
        ]
    },
    {
        label: 'Company',
        items: [
            { label: 'Route-1', href: '/#projects' },
            { label: 'Route-2', href: '/projects' },
            { label: 'Route-3', href: '/projects' },
        ]
    }
]
const Dropdowns = ({ sideMenu, setSideMenu }) => {
    return (
        <>
            {
                menus.map((menu, index) => {
                    return (
                        <li key={index} className="dropdown dropdown-hover cursor-pointer">
                            <div tabIndex={0} role="button" className="inline-flex items-center gap-0.5 dropdown">
                                <div>{menu.label}</div>
                                <div className='flex'>
                                    <div className='icon w-2 h-0.5 bg-primary text-primary rotate-45 opacity-80'></div>
                                    <div className='icon w-2 h-0.5 bg-primary text-primary -rotate-45 opacity-80 -ml-1'></div>
                                </div>
                            </div>
                            <ul tabIndex={0} className="dropdown-content menu bg-[#10263f] mt-0 rounded-box z-1 w-52 p-2 shadow-lg text-white sub-menu">
                                {
                                    menu.items.map((item, index) => {
                                        return (
                                            <a key={index} href={item.href} className=''>
                                                <li onClick={() => setSideMenu(!sideMenu)} className='sub-menu-list' key={index}>
                                                    <div className='flex justify-between'>
                                                        <div className='block w-full'>{item.label}</div>
                                                        <div className='hidden go-icon'>&gt;</div>
                                                    </div>
                                                </li>
                                            </a>
                                        )
                                    })
                                }
                            </ul>
                        </li>
                    )
                })
            }
        </>
    );
};

export default Dropdowns;