'use client';
import React from 'react';
import Link from 'next/link';

const menus = [
  {
    label: 'Candidates',
    items: [
      { label: 'Cadidate Dashboard', href: '/candidate-dashboard' },
      { label: 'Match Your Skill', href: '/match-skill' },
      { label: 'Apply For Job', href: '/apply-job' },
    ],
  },
  {
    label: 'Company',
    items: [
      { label: 'Company Dashboard', href: '/company-dashboard' },
      { label: 'Match Candidate', href: '/match-candidate' },
      { label: 'Post Job', href: '/post-job' },
    ],
  },
];

const Dropdowns = ({ sideMenu, setSideMenu }) => {
  return (
    <>
      {menus.map((menu, index) => {
        return (
          <li key={index} className="dropdown dropdown-hover cursor-pointer">
            <div
              tabIndex={0}
              role="button"
              className="inline-flex items-center gap-0.5 dropdown"
            >
              <div>{menu.label}</div>
              <div className="flex">
                <div className="icon w-2 h-0.5 bg-primary text-primary rotate-45 opacity-80"></div>
                <div className="icon w-2 h-0.5 bg-primary text-primary -rotate-45 opacity-80 -ml-1"></div>
              </div>
            </div>

            <ul
              tabIndex={0}
              className="dropdown-content menu bg-[#10263f] mt-0 rounded-box z-1 w-52 p-2 py-4 space-y-3 shadow-lg text-white sub-menu"
            >
              {menu.items.map((item, i) => {
                return (
                  <li
                    key={i}
                    onClick={() => setSideMenu(!sideMenu)}
                    className="sub-menu-list"
                  >
                    <Link href={item.href} className="block w-full">
                      <div className="flex justify-between">
                        <div>{item.label}</div>
                        <div className="hidden go-icon">&gt;</div>
                      </div>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </li>
        );
      })}
    </>
  );
};

export default Dropdowns;
