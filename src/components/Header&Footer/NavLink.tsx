// NavLink.tsx
import {type  FC } from "react";
import Link from "next/link";

interface NavLinkProps {
  href: string;
  label: string;
  active: boolean;
  onClick?: () => void;
  className?: string;
}

const NavLink: FC<NavLinkProps> = ({ href, label, active, onClick, className = "" }) => {
  const activeClass = active ? "bg-gradient-to-r from-orange-400 to-white text-transparent bg-clip-text" : "";
  return (
    <Link href={href} className={`${activeClass} ${className}`} onClick={onClick}>
      {label}
    </Link>
  );
};

export default NavLink;
