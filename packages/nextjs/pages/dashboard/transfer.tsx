import React, { useState } from "react";
import Image from "next/image";
import { ethers } from "ethers";
import { useWalletClient } from "wagmi";
import { useBalance } from "wagmi";
import { Spinner } from "~~/components/Spinner";
import MyCollectibles from "~~/components/superhack/MyCollectibles";
import PageHOC from "~~/components/superhack/PageHOC";
import SelectActiveToken from "~~/components/superhack/SelectActiveToken";
import { useAccountContext } from "~~/context/AccountContext";
import { useNBACollectible } from "~~/context/NBAContext";
import { useDeployedContractInfo } from "~~/hooks/scaffold-eth";
import { notification } from "~~/utils/scaffold-eth";
import { getEthersSigner } from "~~/utils/scaffold-eth/ethersSigner";


const Transfer = () => {
  const [activeTab, setActiveTab] = useState("sell");
  const [isTxnLoading, setIsTxnLoading] = useState(false);
  const [destinationAddress, setDestinationAddress] = useState("");
  const [transferAmount, setTransferAmount] = useState("");
  const [tokenAddress, setTokenAddress] = useState("");
  const [isTokenAddressChange, setIsTokenAddressChange] = useState(false);
  const { NBACollectibles, isLoading } = useNBACollectible();
  const { activeTokenMainAccount, activeToken } = useAccountContext();
  const {
    data: accountBalance,
    isError,
    isLoading: isLoadingBalance,
  } = useBalance({
    address: activeTokenMainAccount,
    watch: true,
  });
  const {
    data: tokenBalance,
    isError: isTokenBalanceError,
    isLoading: isLoadingTokenBalance,
  } = useBalance({
    address: activeTokenMainAccount,
    token: tokenAddress,
    watch: true,
  });
  const handleTokenAddressChange = (e: any) => {
    setIsTokenAddressChange(true);
    setTokenAddress(e.target.value);
    setTimeout(() => {
      setIsTokenAddressChange(false);
    }, 3000);
  };
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };
  const { data: walletClient } = useWalletClient();
  const { data: accountContract } = useDeployedContractInfo("ERC6551Account");
  const clearInputData = () => {
    setTransferAmount("");
    setDestinationAddress("");
  };
  async function transferEther() {
    try {
      setIsTxnLoading(true);
      if (!accountContract || activeTokenMainAccount === ethers.ZeroAddress || !walletClient) return;
      const signer = await getEthersSigner(walletClient);
      const contract = new ethers.Contract(activeTokenMainAccount, accountContract.abi, signer);
      const tx = await contract.execute(destinationAddress, ethers.parseEther(transferAmount), "0x", 0);
      const receipt = await tx.wait();
      console.log("ETH_Transfer:", receipt);
      receipt && clearInputData();
      return receipt.transactionHash;
    } catch (e: any) {
      console.log(e);
      notification.error(e.message);
    } finally {
      setIsTxnLoading(false);
    }
  }

  async function transferERC20Token(tokenAddress: string) {
    try {
      setIsTxnLoading(true);
      if (!accountContract || !walletClient) return;
      const signer = await getEthersSigner(walletClient);
      const erc20Abi = ["function transfer(address to, uint256 value) public returns (bool)"];
      const tokenContract = new ethers.Contract(tokenAddress, erc20Abi, signer);
      const data = tokenContract.interface.encodeFunctionData("transfer", [
        destinationAddress,
        ethers.parseEther(transferAmount),
      ]);
      const walletContract = new ethers.Contract(activeTokenMainAccount, accountContract.abi, signer);
      const tx = await walletContract.execute(tokenAddress, 0, data, 0);
      const receipt = await tx.wait();
      receipt && clearInputData();
      console.log("ERC20_Transfer:", receipt);
      return receipt.transactionHash;
    } catch (e: any) {
      notification.error(e.message);
      console.log("ERR_TRANSFERRING_ERC20TOKEN", e);
    } finally {
      setIsTxnLoading(false);
    }
  }

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
            Send Ether
          </button>
          <button
            className={`text-xl font-semibold cursor-pointer flex items-center justify-center w-1/2 border-l border-[#ffffff90] ${
              activeTab === "buy" ? "text-[#ffffff]" : "text-[#ffffff9a] hover:text-white"
            }`}
            onClick={() => handleTabChange("buy")}
          >
            Send Token
          </button>
        </div>
        <div className="p-6">
          {activeTab === "sell" ? (
            <div>
              <div className="text-center flex items-center justify-center flex-col">
                <p>Transfer ETH from:</p>
                {isLoading || !activeToken[0]?.image ? (
                  <div className="animate-pulse flex space-x-4 mt-3">
                    <div className="rounded-md bg-slate-300 h-6 w-6"></div>
                    <div className="flex items-center space-y-6">
                      <div className="h-2 w-28 bg-slate-300 rounded"></div>
                    </div>
                  </div>
                ) : (
                  activeToken.length &&
                  !isLoadingBalance &&
                  !isError && (
                    <div className="flex items-center flex-col">
                      <div className="my-2 rounded-lg">
                        <Image src={activeToken[0].image} alt="nft" width={80} height={80} />
                      </div>
                      <span>
                        <SelectActiveToken nbaCollectibles={NBACollectibles} type="address" />
                      </span>
                      <span className="mt-5 rounded-lg text-gray-400 font-semibold text-sm">
                        ETH: {accountBalance?.formatted}
                      </span>
                    </div>
                  )
                )}
              </div>

              <div className="mt-4">
                <label htmlFor="wallet-address">Send to:</label>
                <input
                  className="w-full bg-[#16161B] rounded-lg my-2 p-4"
                  type="text"
                  name="wallet-address"
                  placeholder="Enter Wallet Address"
                  onChange={e => {
                    const val = e.target.value;
                    setDestinationAddress(val);
                  }}
                />
              </div>

              <div className="mt-4">
                <label htmlFor="wallet amount">Amount</label>
                <input
                  className="w-full bg-[#16161B] rounded-lg my-2 p-4"
                  type="number"
                  name="amount"
                  placeholder="Enter Amount"
                  onChange={e => {
                    const val = e.target.value;
                    setTransferAmount(val);
                  }}
                />
              </div>
              <div className="mt-8 flex flex-col items-center">
                <button
                  disabled={
                    !activeTokenMainAccount ||
                    activeTokenMainAccount === ethers.ZeroAddress ||
                    !transferAmount ||
                    !destinationAddress
                  }
                  className="rainbow-btn"
                  onClick={transferEther}
                >
                  <span>
                    {isTxnLoading && <Spinner />}
                    Send
                  </span>
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="text-center flex items-center justify-center flex-col">
                <p>Transfer tokens from:</p>
                {isLoading || !activeToken[0]?.image ? (
                  <div className="animate-pulse flex space-x-4 mt-3">
                    <div className="rounded-md bg-slate-300 h-6 w-6"></div>
                    <div className="flex items-center space-y-6">
                      <div className="h-2 w-28 bg-slate-300 rounded"></div>
                    </div>
                  </div>
                ) : (
                  activeToken.length && (
                    <div className="flex items-center flex-col">
                      <div className="my-2 rounded-lg">
                        <Image src={activeToken[0].image} alt="nft" width={80} height={80} />
                      </div>
                      <span>
                        <SelectActiveToken nbaCollectibles={NBACollectibles} type="address" />
                      </span>
                      {tokenAddress && !isLoadingTokenBalance && !isTokenBalanceError && tokenBalance ? (
                        <span className="mt-5 text-gray-400 font-semibold text-sm">
                          {tokenBalance.formatted} {tokenBalance.symbol}
                        </span>
                      ) : isTokenAddressChange || isLoadingBalance ? (
                        <div className="animate-pulse flex space-x-4 mt-3">
                          <div className="rounded-md bg-slate-300 h-6 w-6"></div>
                          <div className="flex items-center space-y-6">
                            <div className="h-2 w-28 bg-slate-300 rounded"></div>
                          </div>
                        </div>
                      ) : (
                        <span className="mt-5 text-xs text-orange-300">
                          Nothing found, check token address and retry.
                        </span>
                      )}
                    </div>
                  )
                )}
              </div>

              <div className="mt-4">
                <label htmlFor="wallet-address">ERC20 token address:</label>
                <input
                  className="w-full bg-[#16161B] rounded-lg my-2 p-4"
                  type="text"
                  name="token-address"
                  placeholder="Enter Token Address"
                  onChange={handleTokenAddressChange}
                />
              </div>

              <div className="mt-4">
                <label htmlFor="wallet-address">Send to:</label>
                <input
                  className="w-full bg-[#16161B] rounded-lg my-2 p-4"
                  type="text"
                  name="wallet-address"
                  placeholder="Enter Wallet Address"
                  onChange={e => {
                    const val = e.target.value;
                    setDestinationAddress(val);
                  }}
                />
              </div>

              <div className="mt-4">
                <label htmlFor="wallet amount">Amount</label>
                <input
                  className="w-full bg-[#16161B] rounded-lg my-2 p-4"
                  type="number"
                  name="amount"
                  placeholder="Enter Amount"
                  onChange={e => {
                    const val = e.target.value;
                    setTransferAmount(val);
                  }}
                />
              </div>

              <div className="mt-8 flex flex-col items-center">
                <button
                  disabled={
                    !activeTokenMainAccount ||
                    activeTokenMainAccount === ethers.ZeroAddress ||
                    !transferAmount ||
                    !destinationAddress
                  }
                  className="rainbow-btn"
                  onClick={() => transferERC20Token(tokenAddress)}
                >
                  <span>
                    {isTxnLoading && <Spinner />}
                    Send
                  </span>
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
          <MyCollectibles imageWidth={80} imageHeight={80} displayMainAccount={true} />
        </div>
      </div>
    </section>
  );
};

export default PageHOC(Transfer);