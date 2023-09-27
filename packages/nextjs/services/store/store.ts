import create from "zustand";

/**
 * Zustand Store
 *
 * You can add global state to the app using this useGlobalState, to get & set
 * values from anywhere in the app.
 *
 * Think about it as a global useState.
 */

type TGlobalState = {
  nativeCurrencyPrice: number;
  setNativeCurrencyPrice: (newNativeCurrencyPriceState: number) => void;
};

export const useGlobalState = create<TGlobalState>(set => ({
  nativeCurrencyPrice: 0,
  setNativeCurrencyPrice: (newValue: number): void => set(() => ({ nativeCurrencyPrice: newValue })),
}));

type TAppStore = {
  ethPrice: number;
  setEthPrice: (newEthPriceState: number) => void;

  walletAddress: string;
  setWalletAddress: (newAddress: string) => void;

  currentWalletContract: any;
  setCurrentWalletContract: (wallet: any) => void;

  txPoolLength: string | any;
  setTxPoolLength: (value: any) => void;
};

export const useAppStore = create<TAppStore>(set => ({
  ethPrice: 0,
  setEthPrice: (newValue: number): void => set(() => ({ ethPrice: newValue })),
  walletAddress: "",
  setWalletAddress: (newAddress: string): void => set(() => ({ walletAddress: newAddress })),

  currentWalletContract: undefined,
  setCurrentWalletContract: (wallet: any): void => set(() => ({ currentWalletContract: wallet })),

  txPoolLength: undefined,
  setTxPoolLength: (value: any): void => set(() => ({ txPoolLength: value })),
}));
