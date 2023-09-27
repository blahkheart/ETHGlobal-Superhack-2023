import React, { useCallback, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { Bars3Icon, ChartBarIcon, HomeIcon, SparklesIcon, ViewColumnsIcon } from "@heroicons/react/24/outline";
import { FaucetButton, RainbowKitCustomConnectButton } from "~~/components/scaffold-eth";
import { useOutsideClick } from "~~/hooks/scaffold-eth";

const NavLink = ({ href, children }: { href: string; children: React.ReactNode }) => {
  const router = useRouter();
  const isActive = router.pathname === href;

  return (
    <Link
      href={href}
      passHref
      className={`${
        isActive ? "bg-[#ffffff20] shadow-md" : ""
      } hover:bg-[#ffffff20] focus:[#ffffff20] py-1.5 px-3 text-sm rounded-full gap-2`}
    >
      {children}
    </Link>
  );
};

/**
 * Site header
 */
const HomeHeader = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const burgerMenuRef = useRef<HTMLDivElement>(null);
  useOutsideClick(
    burgerMenuRef,
    useCallback(() => setIsDrawerOpen(false), []),
  );

  const navLinks = (
    <>
      <li>
        <NavLink href="/">
          <HomeIcon className="h-4 w-4" />
          Home
        </NavLink>
      </li>
      <li>
        <NavLink href="/list">
          <ViewColumnsIcon className="h-4 w-4" />
          View NFTs
        </NavLink>
      </li>
      <li>
        <NavLink href="/mint">
          <SparklesIcon className="h-4 w-4" />
          Mint NFT
        </NavLink>
      </li>
      <li>
        <NavLink href="/dashboard">
          <ChartBarIcon className="h-4 w-4" />
          Dashboard
        </NavLink>
      </li>
    </>
  );

  return (
    <div className="sticky lg:static top-0 navbar bg-none min-h-0 flex-shrink-0 justify-between z-20 shadow-secondary px-0 sm:px-2 py-6">
      <div className="navbar-start w-auto lg:w-1/2">
        <div className="lg:hidden dropdown" ref={burgerMenuRef}>
          <label
            tabIndex={0}
            className={`ml-1 btn btn-ghost ${isDrawerOpen ? "hover:bg-secondary" : "hover:bg-transparent"}`}
            onClick={() => {
              setIsDrawerOpen(prevIsOpenState => !prevIsOpenState);
            }}
          >
            <Bars3Icon className="h-1/2" />
          </label>
          {isDrawerOpen && (
            <ul
              tabIndex={0}
              className="menu menu-compact dropdown-content mt-3 p-2 shadow rounded-box w-52 bg-primary flex flex-col space-y-2"
              onClick={() => {
                setIsDrawerOpen(false);
              }}
            >
              {navLinks}
            </ul>
          )}
        </div>
        <Link href="/" passHref className="hidden lg:flex items-center gap-2 ml-4 mr-10">
          <div className="flex relative w-10 h-10">
            <Image alt="SE2 logo" className="cursor-pointer" fill src="/logo.svg" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold leading-tight">NBA</span>
          </div>
        </Link>
        <ul className="hidden lg:flex lg:flex-nowrap menu menu-horizontal px-1 gap-4">{navLinks}</ul>
      </div>
      <div className="navbar-end flex-grow mr-4">
        <RainbowKitCustomConnectButton />
        <FaucetButton />
      </div>
    </div>
  );
};

/* import React from "react";
import Image from "next/image";
import Link from "next/link";
import { RainbowKitCustomConnectButton } from "./scaffold-eth";

const HomeHeader = () => {
  return (
    <header>
      <div className=" py-8 pt-10 flex justify-between container mx-auto">
        <div>
          <Link href="/">
            <Image width={135} height={46} src={"/assets/logo.svg"} alt="NBA logo" />
          </Link>
        </div>
        <div className="flex flex-row space-x-10">
          <Link href="/mint">
            <button className="rainbow-btn small w-[5rem]">
              <span>Mint NFT</span>
            </button>
          </Link>
          <Link href="/list">
            <button className="rainbow-btn small w-[6rem]">
              <span>View NFTs</span>
            </button>
          </Link>
          <Link href="/dashboard">
            <button className="rainbow-btn small w-[5rem]">
              <span>Go to app</span>
            </button>
          </Link>
          <RainbowKitCustomConnectButton />
        </div>
      </div>
    </header>
  );
};

export default HomeHeader; */

export default HomeHeader;
