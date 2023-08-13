import React from "react";
import Image from "next/image";
import Link from "next/link";
import { RainbowKitCustomConnectButton } from "./scaffold-eth";

const HomeHeader = () => {
  return (
    <header>
      <div className=" py-8 pt-10 flex justify-between container mx-auto">
        <div>
          <Image width={135} height={46} src={"/assets/logo.svg"} alt="NBA logo" />
        </div>
        <div className="flex flex-row space-x-10">
          <Link href="/mint" className="rainbow-btn small w-[5rem]">
            <span>Mint NFT</span>
          </Link>
          <Link href="/list" className="rainbow-btn small w-[6rem]">
            <span>View NFT</span>
          </Link>
          <Link href="/dashboard" className="rainbow-btn small w-[5rem]">
            <span>Go to app</span>
          </Link>
          <RainbowKitCustomConnectButton />
        </div>
      </div>
    </header>
  );
};

export default HomeHeader;
