"use client";
import Image from "next/image";
import { useState } from "react";
import { navItems } from "./navData";

export default function Header() {
  const [openMenu, setOpenMenu] = useState(null);

  return (
    <header className="w-full border-b bg-white shadow-sm">
      {/* Top Row */}
      <div className="max-w-7xl mx-auto flex items-center justify-between py-2 px-4">
        
        {/* Left: Logo + Ministry Name */}
        <div className="flex items-center space-x-3">
          <Image src="/emblem.png" alt="Emblem of India" width={40} height={50} />
          <div>
            <p className="text-sm font-medium">Government of India</p>
            <h1 className="text-base font-semibold leading-tight">
              Ministry of Electronics <br/> and Information Technology
            </h1>
          </div>
        </div>

        {/* Center: Search */}
        <div className="flex items-center border rounded overflow-hidden w-72">
          <input
            type="text"
            placeholder="Search..."
            className="flex-grow px-3 py-1 text-sm outline-none"
          />
          <button className="bg-gray-100 px-3">🔍</button>
        </div>

        {/* Right: Digital India Logo + Icons */}
        <div className="flex items-center space-x-4">
          <Image src="/digital-india.png" alt="Digital India" width={100} height={40} />
          <button title="Language" className="hover:text-blue-700">अ/En</button>
          <button title="Accessibility" className="hover:text-blue-700">♿</button>
        </div>
      </div>

      {/* Bottom Nav */}
      <nav className="bg-white border-t">
        <ul className="flex justify-center space-x-8 py-2 font-medium text-gray-800 relative">
          {navItems.map((item, i) => (
            <li
              key={i}
              className="relative group"
              onMouseEnter={() => setOpenMenu(i)}
              onMouseLeave={() => setOpenMenu(null)}
            >
              <a href={item.link || "#"} className="hover:text-blue-700 cursor-pointer">
                {item.name} {item.children && "▼"}
              </a>
              
              {item.children && openMenu === i && (
                <ul className="absolute top-8 left-0 bg-white shadow-lg border rounded w-48">
                  {item.children.map((child, j) => (
                    <li key={j}>
                      <a
                        href={child.link}
                        className="block px-4 py-2 hover:bg-gray-100"
                      >
                        {child.name}
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
