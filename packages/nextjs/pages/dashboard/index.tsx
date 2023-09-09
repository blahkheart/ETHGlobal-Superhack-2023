import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import Blockies from "react-blockies";
import { BiPlus } from "react-icons/bi";
import { useAccount } from "wagmi";
import { WalletIcon, XMarkIcon } from "@heroicons/react/20/solid";
import PageHOC from "~~/components/superhack/PageHOC";
import BaseModal from "~~/components/superhack/modals/BaseModal";
import { useAccountContext } from "~~/context/AccountContext";
import { useNBACollectible } from "~~/context/NBAContext";
import { NFTData } from "~~/types/nftData";
import { initWallet } from "~~/utils/account/createAccount";

const Dashboard = () => {
  const { NBACollectibles, isLoading } = useNBACollectible();
  const { accountAddress, updateAccountAddress } = useAccountContext();
  const { address } = useAccount();
  const [activeTab, setActiveTab] = useState("my tokens");
  const [isOpen, setIsOpen] = useState(false);
  const [displayAddress, setDisplayAddress] = useState("0x0000...0000");
  const [activeToken, setActiveToken] = useState<NFTData[]>([]);
  const [mainAccount, setMainAccount] = useState("");

  const truncateAddress = (address: string) => {
    return address.slice(0, 5) + "..." + address.slice(-4);
  };

  useEffect(() => {
    setDisplayAddress(address ?? ethers.ZeroAddress);
  }, [address]);

  async function createWallet() {
    const wallet = await initWallet();
    if (!wallet) return alert("Could not generate wallet");
    updateAccountAddress(wallet);
  }

  async function handleWalletCreated() {
    await createWallet();
    setIsOpen(false);
  }

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  const handleSelectActiveToken = (e: any) => {
    const _tokenId = parseInt(e.target.value);
    const selectedToken = NBACollectibles.filter(token => token.id === _tokenId);
    setActiveToken(selectedToken);
  };
  const getMainAccountFromTokenAttribute = (token: NFTData): string => {
    const [mainAcc] = token.attributes.filter(item => item.trait_type === "Main Account");
    return mainAcc.value;
  };
  useEffect(() => {
    const loadDefaultMainAccount = async () => {
      try {
        if (NBACollectibles.length > 0) {
          const defaultToken = NBACollectibles[0];
          const mainAcc = getMainAccountFromTokenAttribute(defaultToken);
          setMainAccount(mainAcc);
        }
      } catch (e) {
        console.log(e);
      }
    };
    loadDefaultMainAccount();
  }, [NBACollectibles]);

  useEffect(() => {
    const setActiveTokenMainAccount = async () => {
      try {
        if (activeToken.length > 0) {
          const [_activeToken] = activeToken;
          const mainAcc = getMainAccountFromTokenAttribute(_activeToken);
          setMainAccount(mainAcc);
        }
      } catch (e) {
        console.log(e);
      }
    };
    setActiveTokenMainAccount();
  }, [activeToken]);

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
                  seed={accountAddress ? accountAddress.toLowerCase() : "0x0000000000"}
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
                <p>Active token</p>
                {NBACollectibles && NBACollectibles.length > 0 ? (
                  <select className="select select-xs select-ghost bg-transparent" onChange={handleSelectActiveToken}>
                    {NBACollectibles.map(item => (
                      <option value={item.id} key={item.id}>
                        {item.name}
                      </option>
                    ))}
                  </select>
                ) : (
                  <div className="animate-pulse flex space-x-4">
                    <div className="rounded-md bg-slate-300 h-6 w-6"></div>
                    <div className="flex items-center space-y-6">
                      <div className="h-2 w-28 bg-slate-300 rounded"></div>
                    </div>
                  </div>
                )}
              </div>
              <div>
                <p>Main Account</p>
                {mainAccount && !isLoading ? (
                  truncateAddress(mainAccount)
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
              <div className="grid justify-center  items-center  min-h-[480px] ">
                <div className="grid gap-8 text-center justify-center">
                  <p className="text-[1.2rem] md:text-[1.8rem]">You don’t have any funds on this account</p>
                  <button className="px-12 py-5 border-[1px] border-super-gradient rounded-2xl bg-black w-fit mx-auto">
                    {" "}
                    Deposit
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center min-h-[480px]">Ho</div>
            )}
          </div>
        </div>
      </div>
      {isOpen && (
        <BaseModal onClose={() => setIsOpen(false)}>
          <div className="relative text-center max-w-[500px] md:w-[500px] flex flex-col gap-5 items-center justify-center bg-super-dark rounded-xl p-8">
            {/* Render an XMarkIcon with an onClick event that calls the onClose function */}
            <XMarkIcon
              onClick={() => setIsOpen(false)}
              className="w-8 h-8 text-[#a2aab6] cursor-pointer absolute right-6 top-6"
            />
            <div className="p-2 w-fit rounded-xl bg-[#a2aab6]">
              <WalletIcon className="w-8 h-8 " /> {/* Render a WalletIcon */}
            </div>
            <h3 className="text-lg font-bold mb-0">Create account</h3> {/* Render the main message */}
            <p className="mt-0 text-[#a2aab6]"></p>
            <button onClick={handleWalletCreated} className="hover:bg-black border-b-2 rounded-2xl p-3">
              Confirm account creation
            </button>
          </div>
        </BaseModal>
      )}
    </div>
  );
};

export default PageHOC(Dashboard);
