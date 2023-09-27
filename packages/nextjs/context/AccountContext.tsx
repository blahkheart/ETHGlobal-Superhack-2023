import React, { createContext, useContext, useEffect, useState } from "react";
import { ethers } from "ethers";
import { useWalletClient } from "wagmi";
import { useNBACollectible } from "~~/context/NBAContext";
import { useDeployedContractInfo } from "~~/hooks/scaffold-eth";
import { NFTData } from "~~/types/nftData";
import { getMainAccountFromTokenAttribute } from "~~/utils/account/getMainAccountFromTokenAttribute";
import { getEthersSigner } from "~~/utils/scaffold-eth/ethersSigner";

export interface IAccountContextType {
  activeToken: any;
  setActiveToken: (token: any) => void;
  activeTokenMainAccount: string;
  activeAccountContract: ethers.Contract | undefined;
}

const AccountContext = createContext<IAccountContextType | undefined>(undefined);

export function AccountContextProvider({ children }: { children: React.ReactNode }) {
  const { NBACollectibles } = useNBACollectible();
  const [activeToken, setActiveToken] = useState<NFTData[]>([]);
  const [activeTokenMainAccount, setActiveTokenMainAccount] = useState("");
  const [activeAccountContract, setActiveAccountContract] = useState<ethers.Contract>();
  const { data: accountContract } = useDeployedContractInfo("ERC6551Account");
  const { data: walletClient } = useWalletClient();

  useEffect(() => {
    const loadDefaultMainAccount = async () => {
      try {
        if (NBACollectibles.length > 0) {
          const defaultToken = NBACollectibles[0];
          const mainAcc = getMainAccountFromTokenAttribute(defaultToken);
          setActiveToken([defaultToken]);
          setActiveTokenMainAccount(mainAcc);
        }
      } catch (e) {
        console.log(e);
      }
    };
    loadDefaultMainAccount();
  }, [NBACollectibles]);

  useEffect(() => {
    const loadActiveTokenMainAccount = async () => {
      try {
        if (activeToken.length > 0) {
          const [_activeToken] = activeToken;
          const mainAcc = getMainAccountFromTokenAttribute(_activeToken);
          setActiveTokenMainAccount(mainAcc);
        }
      } catch (e) {
        console.log(e);
      }
    };
    loadActiveTokenMainAccount();
  }, [activeToken]);

  useEffect(() => {
    const loadActiveAccountContract = async () => {
      try {
        if (!accountContract || activeTokenMainAccount === ethers.ZeroAddress || !walletClient) return;
        const signer = await getEthersSigner(walletClient);
        const contract = new ethers.Contract(activeTokenMainAccount, accountContract.abi, signer);
        setActiveAccountContract(contract);
      } catch (e) {
        console.log(e);
      }
    };
    loadActiveAccountContract();
  }, [accountContract, activeToken, activeTokenMainAccount, walletClient]);

  return (
    <AccountContext.Provider
      value={{
        activeToken,
        setActiveToken,
        activeTokenMainAccount,
        activeAccountContract,
      }}
    >
      {children}
    </AccountContext.Provider>
  );
}

export function useAccountContext() {
  const context = useContext(AccountContext);
  if (!context) {
    throw new Error("useAccountContext must be used within a AccountContextProvider");
  }
  return context;
}
