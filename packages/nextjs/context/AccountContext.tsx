import React, { createContext, useContext, useState } from "react";

export interface IAccountContextType {
  accountAddress: string | null;
  updateAccountAddress: (newAddress: string) => void;
}

const AccountContext = createContext<IAccountContextType | undefined>(undefined);

export function AccountContextProvider({ children }: { children: React.ReactNode }) {
  const [accountAddress, setAccountAddress] = useState<string | null>(null);

  const updateAccountAddress = (newAddress: string) => {
    setAccountAddress(newAddress);
  };

  return <AccountContext.Provider value={{ accountAddress, updateAccountAddress }}>{children}</AccountContext.Provider>;
}

export function useAccountContext() {
  const context = useContext(AccountContext);
  if (!context) {
    throw new Error("useAccountContext must be used within a AccountContextProvider");
  }
  return context;
}
