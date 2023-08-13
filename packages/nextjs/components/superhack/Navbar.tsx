import React from "react";
import { RainbowKitCustomConnectButton } from "../scaffold-eth";

const Navbar = () => {
  return (
    <div className=" py-8 border-b-[3px]  border-gray-500 flex justify-between">
      <h2 className="text-[1.8rem]">NFT Wallet</h2>
      <RainbowKitCustomConnectButton />
    </div>
  );
};

export default Navbar;
