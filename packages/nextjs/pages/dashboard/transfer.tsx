import React, { useState } from "react";
import Image from "next/image";
import { useAccount } from "wagmi";
import PageHOC from "~~/components/superhack/PageHOC";

const Transfer = () => {
  const [activeTab, setActiveTab] = useState("sell");
  const { address } = useAccount();
  const displayAddress = address?.slice(0, 5) + "..." + address?.slice(-4);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  return (
    <section className="py-16 flex">
      <div className="bg-[#1F1E27] rounded-md w-1/2">
        <div className="flex mb-4 border-b border-[#ffffff90]">
          <button
            className={`text-xl font-semibold cursor-pointer flex items-center justify-center w-1/2 p-6 ${
              activeTab === "sell" ? "text-[#ffffff]" : "text-[#ffffffaa] hover:text-white"
            }`}
            onClick={() => handleTabChange("sell")}
          >
            Send Crypto
          </button>
          <button
            className={`text-xl font-semibold cursor-pointer flex items-center justify-center w-1/2 border-l border-[#ffffff90] ${
              activeTab === "buy" ? "text-[#ffffff]" : "text-[#ffffff9a] hover:text-white"
            }`}
            onClick={() => handleTabChange("buy")}
          >
            Buy Crypto
          </button>
        </div>
        <div className="p-6">
          {activeTab === "sell" ? (
            <div>
              <div className="text-center flex items-center justify-center flex-col">
                <p>Transfer funds from:</p>
                <div className="my-2 border-2 border-[#fff] rounded-lg">
                  <Image src="/assets/nft1.png" alt="nft" width={80} height={80} />
                </div>
                <span>
                  {" "}
                  {address ? (
                    <p className="text-[2.2 rem]">{displayAddress}</p>
                  ) : (
                    <p className="text-[2.2 rem]">0x000..000</p>
                  )}
                </span>
              </div>

              <div className="mt-4">
                <label htmlFor="wallet-address">Send to:</label>
                <input
                  className="w-full bg-[#16161B] rounded-lg my-2 p-4"
                  type="text"
                  name="wallet-address"
                  placeholder="Enter Wallet Address"
                />
              </div>

              <div className="mt-4">
                <label htmlFor="wallet amount">Amount</label>
                <input
                  className="w-full bg-[#16161B] rounded-lg my-2 p-4"
                  type="number"
                  name="amount"
                  placeholder="Enter Amount"
                />
              </div>
              <div className="mt-8 flex flex-col items-center">
                <button className="rainbow-btn">
                  <span>Send</span>
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="text-center flex items-center justify-center flex-col">
                <p>Deposit to:</p>
                <div className="my-2 border-2 border-[#fff] rounded-lg">
                  <Image src="/assets/nft1.png" alt="nft" width={80} height={80} />
                </div>
                <span>
                  {" "}
                  {address ? (
                    <p className="text-[2.2 rem]">{displayAddress}</p>
                  ) : (
                    <p className="text-[2.2 rem]">0x000..000</p>
                  )}
                </span>
              </div>

              <div className="mt-4">
                <label htmlFor="wallet-address">Send to:</label>
                <input
                  className="w-full bg-[#16161B] rounded-lg my-2 p-4"
                  type="text"
                  name="wallet-address"
                  placeholder="Enter Wallet Address"
                />
              </div>

              <div className="mt-4">
                <label htmlFor="wallet amount">Amount</label>
                <input
                  className="w-full bg-[#16161B] rounded-lg my-2 p-4"
                  type="number"
                  name="amount"
                  placeholder="Enter Amount"
                />
              </div>

              <div className="mt-8 flex flex-col items-center">
                <button className="rainbow-btn">
                  <span>Buy</span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      <div className="bg-[#1F1E27] rounded-md w-1/2 ml-[1rem]">
        <div className="flex mb-4 border-b border-[#ffffff90]">
          <p className={`text-xl font-semibold cursor-pointer flex items-center justify-center w-full p-6`}>
            Collections
          </p>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-3">
            <div className="text-center flex items-center justify-center flex-col">
              <div className="my-2 border-2 border-[#fff] rounded-lg">
                <Image src="/assets/nft1.png" alt="nft" width={80} height={80} />
              </div>
              <span>
                {address ? (
                  <p className="text-[2.2 rem]">{displayAddress}</p>
                ) : (
                  <p className="text-[2.2 rem]">0x000..000</p>
                )}
              </span>
            </div>
          </div>
          <div className="text-center flex items-center justify-center flex-col">
            <div className="my-2 border-2 border-[#fff] rounded-lg">
              <Image src="/assets/nft2.png" alt="nft" width={80} height={80} />
            </div>
            <span>
              {address ? (
                <p className="text-[2.2 rem]">{displayAddress}</p>
              ) : (
                <p className="text-[2.2 rem]">0x000..000</p>
              )}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PageHOC(Transfer);
