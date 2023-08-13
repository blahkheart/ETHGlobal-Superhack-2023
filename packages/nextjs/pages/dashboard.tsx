import React, { useState } from "react";
import Blockies from "react-blockies";
import { BiPlus } from "react-icons/bi";
import { useAccount } from "wagmi";
import { XMarkIcon } from "@heroicons/react/20/solid";
import { AddressInput, IntegerInput } from "~~/components/scaffold-eth";
import PageHOC from "~~/components/superhack/PageHOC";
import BaseModal from "~~/components/superhack/modals/BaseModal";
import LoadingModal from "~~/components/superhack/modals/LoadingModal";

const Dashboard = () => {
  const { address } = useAccount();
  const [openAccountCreation, setOpenAccountCreation] = useState(false);
  const [isCreatingAccount, setIsCreatingAccount] = useState(false);
  const [displayAddress, setDisplayAddress] = useState("0x0000...0000");
  React.useEffect(() => {
    setDisplayAddress(address ? address?.slice(0, 5) + "..." + address?.slice(-4) : "0x0000...0000");
  }, [address]);

  const [nftContractAddress, setNftContractAddress] = useState("");
  const [walletChainId, setWalletChainId] = useState<string | bigint>("");
  const [nftTokedId, setNftTokenId] = useState<string | bigint>("");
  const [walletImplementationContractAddress, setWalletImplementationContractAddress] = useState("");

  const handleAccountCreation = async () => {
    setIsCreatingAccount(true);
    console.log("handleAccountCreation");
    console.log("nftContractAddress", nftContractAddress);
    console.log("walletChainId", walletChainId);
    console.log("nftTokedId", nftTokedId);
    console.log("walletImplementationContractAddress", walletImplementationContractAddress);
  };
  return (
    <div className="dashboard__container mt-10">
      <div className=" dashboard__container-content ">
        <div className="bg-super-dark p-8 min-h-[246px] rounded">
          <p className="text-xl">Accout 1</p>
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
                <p>Address</p>
                <p className="text-[1.2rem]">{displayAddress}</p>
              </div>
            </div>
            <div className="grid gap-2 items-center justify-between grid-flow-col">
              <div>
                <p>Balance</p>
                <p className="text-[2.2rem] ">$0.00</p>
              </div>
              <div>
                <p>Token Balance</p>
                <p className="text-[2.2rem] ">--</p>
              </div>
            </div>
          </div>
        </div>
        <div
          onClick={() => setOpenAccountCreation(true)}
          className="bg-super-dark p-8 grid min-h-[256px] cursor-pointer rounded justify-center items-center "
        >
          <div className=" grid gap-3">
            <div className="grid justify-center ">
              {" "}
              <BiPlus size={35} />
            </div>
            <p className="text-xl">Create Wallet</p>
          </div>
        </div>
      </div>
      <div>
        <div className="mt-8 rounded bg-super-dark ">
          <div className="grid sm:grid-cols-2 ">
            <div className="text-center py-8 border-b-[3px] border-super-gradient">
              <p className="text-[1.2rem] md:text-[1.8rem]">My Tokens</p>
            </div>
            <div className="text-center py-8 border-b-[3px] border-gray-600">
              <p className="md:text-[1.8rem]">All Tokens</p>
            </div>
          </div>
          <div className="grid justify-center  items-center min-h-[485px]">
            <div className="grid gap-8 text-center justify-center">
              <p className="text-[1.2rem] md:text-[1.8rem]">You don’t have any funds on this account</p>
              <button className="px-12 py-5 border-[1px] border-super-gradient rounded-2xl bg-black w-fit mx-auto">
                {" "}
                Deposit
              </button>
            </div>
          </div>
        </div>
      </div>
      {openAccountCreation && (
        <BaseModal onClose={() => setOpenAccountCreation(false)}>
          <div className="relative  max-w-[500px] md:w-[500px] flex flex-col gap-5 items-center justify-center bg-super-dark rounded-xl p-8">
            {/* Render an XMarkIcon with an onClick event that calls the onClose function */}
            <XMarkIcon
              onClick={() => setOpenAccountCreation(false)}
              className="w-8 h-8 text-[#a2aab6] cursor-pointer absolute right-6 top-6"
            />
            <div className="mt-8">
              <div className="mb-3">
                <p>Account implementaion</p>
                <AddressInput
                  name="walletImplementationContractAddress"
                  placeholder="Account implementaion"
                  value={walletImplementationContractAddress}
                  onChange={setWalletImplementationContractAddress}
                />
              </div>
              <div className="mt-3">
                <p>Account chainId</p>
                <IntegerInput
                  name="walletChainId"
                  placeholder="Account chainId"
                  value={walletChainId}
                  onChange={setWalletChainId}
                />
              </div>
              <div className="mt-3">
                <p>NFT contract address</p>
                <AddressInput
                  name="nftContractAddress"
                  placeholder="NFT contract address"
                  value={nftContractAddress}
                  onChange={setNftContractAddress}
                />
              </div>
              <div className="mt-3">
                <p>NFt Token Id</p>
                <IntegerInput
                  name="nftTokedId"
                  placeholder="NFt Token Id"
                  value={nftTokedId}
                  onChange={setNftTokenId}
                />
              </div>
              <div className="mt-6 grid justify-end">
                <button onClick={handleAccountCreation} className="rounded-full border-2 py-3 px-6">
                  Create Account
                </button>
              </div>
            </div>
          </div>
        </BaseModal>
      )}
      {isCreatingAccount && <LoadingModal message="Creating account" />}
    </div>
  );
};

export default PageHOC(Dashboard);
