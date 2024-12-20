"use client";

import { type FC, useState, useEffect } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useSession, signOut, signIn } from "next-auth/react";
import NavLink from "./NavLink";



const adminLinks = [
  { href: "/", label: "ಹೋಮ್ ಪೇಜ್"},
];

const userLinks = [
  { href: "/", label: "ಹೋಮ್ ಪೇಜ್"   },
  { href: "/bookings", label: "ಬುಕಿಂಗ್"   },
  { href: "/gallery", label: "ಗ್ಯಾಲರಿ"   },
  { href: "/committee", label: "ಸಮಿತಿ",  },
];

const Header: FC = () => {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const pathname = usePathname() ?? "";
  const isAdminRoute = pathname.startsWith("/admin");

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <div className={`relative ${isOpen ? "overflow-hidden" : ""}`}>
    <header className="sticky-header h-20 backdrop-blur-sm shadow-md p-4 flex items-center justify-between flex-wrap md:justify-start z-50 w-full bg-black">
      <div className="flex justify-center items-center w-full md:w-auto pl-5  h-full">
          <Image
            src="https://utfs.io/f/SVkywvr9y613Ge3d4VotAgyMXxR0bflucYTpSUB8NDEs4mZ7"
            alt="Logo"
            width={600}
            height={200}
            className="w-auto h-full max-w-60"
          />
      </div>

        <nav className="hidden md:flex space-x-8 ml-auto text-white text-lg px-5 gap-5 z-40">
          {session ? (
            isAdminRoute && session.user?.role === "admin" ? (
              adminLinks.map((link) => (
                <div key={link.href} className="flex items-center gap-2">
                  
                  <NavLink
                    href={link.href}
                    label={link.label}
                    active={pathname === link.href}
                    className="text-xl relative top-1"
                  />
                </div>
              ))
            ) : (
              userLinks.map((link) => (
                <div key={link.href} className="flex items-center justify-center gap-1 h-full ">
                  <NavLink
                    href={link.href}
                    label={link.label}
                    active={link.href === "/" ? pathname === link.href : pathname.startsWith(link.href)}
                    className="text-xl relative top-1"
                  />
                </div>
              ))
            )
          ) : (
            userLinks.map((link) => (
              <div key={link.href} className="flex items-center gap-1">
                
                <NavLink
                  href={link.href}
                  label={link.label}
                  active={link.href === "/" ? pathname === link.href : pathname.startsWith(link.href)}
                  className="text-xl  relative top-1"
                />
              </div>
            ))
          )}
          {!session && isAdminRoute && (
            <button
              onClick={() => signIn()}
              className="text-white text-xl flex"
            >
            <span className=" relative top-0.5">SignIn</span>
            </button>
          )}
          {session && isAdminRoute && session.user?.role === "admin" && (
            <button
              onClick={() => signOut()}
              className="text-white text-xl flex items-center gap-3"
            >
            <span className=" relative top-0.5">ಲಾಗ್ ಔಟ್</span>
            </button>
          )}
        </nav>
        <button
          aria-label="Open Menu"
          className="md:hidden text-white text-2xl focus:outline-none absolute right-4"
          onClick={() => setIsOpen(true)}
        >
          &#9776;
        </button>
      </header>

      <div
        className={`fixed inset-y-0 right-0 w-64 max-w-full bg-black opacity-100 p-6 space-y-6 
          transform transition-transform duration-300 z-50 
          ${isOpen ? "translate-x-0" : "translate-x-full"
        }`}
        role="dialog"
        aria-modal="true"
      >
        <button
          aria-label="Close Menu"
          className="text-white text-3xl mb-4"
          onClick={() => setIsOpen(false)}
        >
          &times;
        </button>
        {/* Mobile Menu */}
        <div className="flex flex-col space-y-4 text-white gap-2">
          {session ? (
            isAdminRoute && session.user?.role === "admin" ? (
              adminLinks.map((link) => (
                <div key={link.href} className="flex items-center gap-3">
                  
                  <NavLink
                    href={link.href}
                    label={link.label}
                    active={pathname === link.href}
                    onClick={() => setIsOpen(false)}
                    className="text-xl w-fit  "
                  />
                </div>
              ))
            ) : (
              userLinks.map((link) => (
                <div key={link.href} className="flex items-center gap-1">
                  
                  <NavLink
                    href={link.href}
                    label={link.label}
                    active={link.href === "/" ? pathname === link.href : pathname.startsWith(link.href)}
                    onClick={() => setIsOpen(false)}
                    className="text-xl w-fit "
                  />
                </div>
              ))
            )
          ) : (
            userLinks.map((link) => (
              <div key={link.href} className="flex items-center gap-1">
                
                <NavLink
                  href={link.href}
                  label={link.label}
                  active={link.href === "/" ? pathname === link.href : pathname.startsWith(link.href)}
                  onClick={() => setIsOpen(false)}
                  className="text-xl w-fit "
                />
              </div>
            ))
          )}

          {!session && isAdminRoute && (
            <button
              onClick={() => signIn()}
              className="text-white text-xl flex"
            >
          <span className=" relative top-0.5">SignIn</span>
            </button>
          )}
          {session && isAdminRoute && session.user?.role === "admin" && (
            <button
              onClick={() => signOut()}
              className="text-white text-xl flex items-center gap-3"
            >
              ಲಾಗ್ ಔಟ್
            </button>
          )}
        </div>
      </div>

      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-40"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}
    </div>
  );
};

export default Header;
