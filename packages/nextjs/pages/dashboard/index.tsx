import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ethers } from "ethers";
import Blockies from "react-blockies";
import { BiPlus } from "react-icons/bi";
import { useAccount } from "wagmi";
import { useBalance } from "wagmi";
import { WalletIcon, XMarkIcon } from "@heroicons/react/20/solid";
import PageHOC from "~~/components/superhack/PageHOC";
import SelectActiveToken from "~~/components/superhack/SelectActiveToken";
import BaseModal from "~~/components/superhack/modals/BaseModal";
import { useAccountContext } from "~~/context/AccountContext";
import { useNBACollectible } from "~~/context/NBAContext";
import { useDeployedContractInfo } from "~~/hooks/scaffold-eth";
import { useScaffoldContractWrite } from "~~/hooks/scaffold-eth";
import ethLogo from "~~/public/ethereum-eth-logo.svg";
import { truncateAddress } from "~~/utils/account/truncateAddress";

const Dashboard = () => {
  const { NBACollectibles, isLoading } = useNBACollectible();
  const { address } = useAccount();
  const [activeTab, setActiveTab] = useState("my tokens");
  const [isOpen, setIsOpen] = useState(false);
  const [displayAddress, setDisplayAddress] = useState("0x0000...0000");
  const [implementation, setImplementation] = useState("");
  const [tokenId, setTokenId] = useState("");
  const [salt, setSalt] = useState("");
  const [chainId, setChainId] = useState("31337");
  const [tokenContract, setTokenContract] = useState("");
  const { activeTokenMainAccount } = useAccountContext();
  const {
    data: accountBalance,
    isError,
    isLoading: isLoadingBalance,
  } = useBalance({
    address: activeTokenMainAccount,
    watch: true,
  });
  useEffect(() => {
    setDisplayAddress(address ?? ethers.ZeroAddress);
  }, [address]);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  const { data: nbaContract } = useDeployedContractInfo("NBA");
  const { data: defaultImplementationContract } = useDeployedContractInfo("ERC6551Account");

  useEffect(() => {
    try {
      if (nbaContract && defaultImplementationContract) {
        setTokenContract(nbaContract.address);
        setImplementation(defaultImplementationContract.address);
      }
    } catch (e) {
      console.log(e);
    }
  }, [nbaContract, defaultImplementationContract]);

  const { writeAsync: createNewAccount } = useScaffoldContractWrite({
    contractName: "ERC6551Registry",
    functionName: "createAccount",
    args: [implementation, BigInt(chainId), tokenContract, BigInt(tokenId), BigInt(salt), "0x"],
  });

  const createAccount = async () => {
    const wallet = await createNewAccount();
    console.log("WALLET", wallet);
  };

  return (
    <div className="dashboard__container mt-10">
      <div className=" dashboard__container-content ">
        <div className="bg-super-dark p-8 min-h-[246px] rounded">
          <p className="text-xl">Account</p>
          <div className="mt-8 px-3">
            <div className="grid grid-flow-col justify-start gap-4 mb-6">
              <div>
                <Blockies
                  className="mx-auto rounded-xl"
                  size={18}
                  seed={address ? address.toLowerCase() : "0x0000000000"}
                  scale={3}
                />
              </div>
              <div className="grid justify-between">
                <p>Owner</p>

                <p className="text-[2.2 rem]">{truncateAddress(displayAddress)}</p>
              </div>
            </div>
            <div className="grid gap-2 items-center justify-between grid-flow-col">
              <div>
                <p className="ml-2">Active token</p>
                <SelectActiveToken nbaCollectibles={NBACollectibles} type="name" />
              </div>
              <div>
                <p>Main Account</p>
                {activeTokenMainAccount && !isLoading ? (
                  truncateAddress(activeTokenMainAccount)
                ) : (
                  <div className="animate-pulse flex space-x-4">
                    <div className="rounded-md bg-slate-300 h-6 w-6"></div>
                    <div className="flex items-center space-y-6">
                      <div className="h-2 w-28 bg-slate-300 rounded"></div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        <div
          onClick={() => setIsOpen(true)}
          className="bg-super-dark p-8 grid min-h-[256px] cursor-pointer rounded justify-center items-center "
        >
          <div className=" grid gap-3">
            <p className="grid justify-center ">
              <BiPlus size={35} />
            </p>
            <p className="text-xl">Create Wallet</p>
          </div>
        </div>
      </div>
      <div>
        <div className="mt-8 rounded bg-super-dark ">
          <div className="grid sm:grid-cols-2 ">
            <button
              className={`text-center py-8 border-b-[3px]  ${
                activeTab === "my tokens" ? "border-b-[3px] border-super-gradient" : "border-[#ffffff90]"
              }`}
              onClick={() => handleTabChange("my tokens")}
            >
              <p className="text-[1.2rem] md:text-[1.8rem]">My Tokens</p>
            </button>
            <button
              className={`text-center py-8 border-b-[3px]  ${
                activeTab === "all tokens" ? "border-b-[3px] border-super-gradient" : "border-[#ffffff90]"
              }`}
              onClick={() => handleTabChange("all tokens")}
            >
              <p className="md:text-[1.8rem]">All Tokens</p>
            </button>
          </div>

          <div className="min-h-[485px]">
            {activeTab === "my tokens" ? (
              <div>
                {activeTokenMainAccount && !isError && accountBalance && (
                  <div className="grid justify-start items-start min-h-[480px] p-8">
                    <div className="flex">
                      <Image src={ethLogo} alt="nft" width={20} height={20} />
                      <div className="flex items-center ml-4">
                        <div className="flex justify-between">
                          <span className="mr-8">Ethereum</span>
                          <span className="ml-8">{accountBalance.formatted} ETH</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                {!isLoadingBalance && !accountBalance && (
                  <div className="grid justify-center  items-center  min-h-[480px] ">
                    <div className="grid gap-8 text-center justify-center">
                      <p className="text-[1.2rem] md:text-[1.8rem]">You don’t have any funds on this account</p>
                      <Link href="/dashboard/deposit">
                        <button className="px-12 py-5 border-[1px] border-super-gradient rounded-2xl bg-black w-fit mx-auto">
                          {" "}
                          Deposit
                        </button>
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center justify-center min-h-[280px]">Coming soon...</div>
            )}
          </div>
        </div>
      </div>
      {isOpen && (
        <BaseModal onClose={() => setIsOpen(false)}>
          <div className="relative text-center max-w-[500px] md:w-[500px] flex flex-col gap-5 items-center justify-center bg-super-dark rounded-xl p-8">
            <XMarkIcon
              onClick={() => setIsOpen(false)}
              className="w-8 h-8 text-[#a2aab6] cursor-pointer absolute right-6 top-6"
            />
            <div className="p-2 w-fit rounded-xl bg-[#a2aab6]">
              <WalletIcon className="w-8 h-8 " />
            </div>
            <h3 className="text-lg font-bold mb-0">Create account</h3> {/* Render the main message */}
            <div className="mt-0 text-[#a2aab6] w-full">
              <input
                type="text"
                placeholder="Implementation address"
                value={implementation}
                onChange={e => {
                  const val = e.target.value;
                  setImplementation(val);
                }}
                className="input input-bordered input-sm w-full bg-transparent"
              />
            </div>
            <div className="mt-0 text-[#a2aab6] w-full">
              <input
                type="number"
                placeholder="Chain Id"
                value={chainId}
                onChange={e => {
                  const val = e.target.value;
                  setChainId(val);
                }}
                className="input input-bordered focus:outline-none focus:bg-transparent focus:text-gray-400 input-sm w-full bg-transparent"
              />
            </div>
            <div className="mt-0 text-[#a2aab6] w-full">
              <input
                value={tokenContract}
                type="text"
                onChange={e => {
                  const val = e.target.value;
                  setTokenContract(val);
                }}
                placeholder="Token contract address"
                className="input input-bordered focus:outline-none focus:bg-transparent focus:text-gray-400 input-sm w-full bg-transparent"
              />
            </div>
            <div className="mt-0 text-[#a2aab6] w-full">
              <input
                type="number"
                placeholder="Token Id"
                onChange={e => {
                  const val = e.target.value;
                  setTokenId(val);
                }}
                className="input input-bordered focus:outline-none focus:bg-transparent focus:text-gray-400 input-sm w-full bg-transparent"
              />
            </div>
            <div className="mt-0 text-[#a2aab6] w-full">
              <div className="form-control">
                <label className="input-group input-group-sm">
                  <span className="tooltip flex" data-tip="Token Id is used as salt by default unless modified by user">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </span>
                  <input
                    type="number"
                    placeholder="Salt"
                    value={salt}
                    onChange={e => {
                      const val = e.target.value;
                      setSalt(val);
                    }}
                    className="input input-bordered input-sm focus:outline-none focus:bg-transparent focus:text-gray-400 input-sm w-full bg-transparent"
                  />
                </label>
              </div>
            </div>
            <button onClick={createAccount} className="hover:bg-black border-b-2 rounded-2xl p-3">
              Create account
            </button>
          </div>
        </BaseModal>
      )}
    </div>
  );
};

export default PageHOC(Dashboard);
