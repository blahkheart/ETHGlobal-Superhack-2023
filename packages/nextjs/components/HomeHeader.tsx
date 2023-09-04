import React from "react";
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

export default HomeHeader;
