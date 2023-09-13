import React, { createContext, useContext, useEffect, useState } from "react";
import { useNBACollectible } from "~~/context/NBAContext";
import { NFTData } from "~~/types/nftData";
import { getMainAccountFromTokenAttribute } from "~~/utils/account/getMainAccountFromTokenAttribute";

export interface IAccountContextType {
  activeToken: any;
  setActiveToken: (token: any) => void;
  activeTokenMainAccount: string;
}

const AccountContext = createContext<IAccountContextType | undefined>(undefined);

export function AccountContextProvider({ children }: { children: React.ReactNode }) {
  const { NBACollectibles } = useNBACollectible();
  const [activeToken, setActiveToken] = useState<NFTData[]>([]);
  const [activeTokenMainAccount, setActiveTokenMainAccount] = useState("");

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
    const readyActiveTokenMainAccount = async () => {
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
    readyActiveTokenMainAccount();
  }, [activeToken]);

  return (
    <AccountContext.Provider value={{ activeToken, setActiveToken, activeTokenMainAccount }}>
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
