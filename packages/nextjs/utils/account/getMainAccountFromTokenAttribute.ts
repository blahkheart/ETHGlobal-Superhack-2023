import { NFTData } from "~~/types/nftData";

export const getMainAccountFromTokenAttribute = (token: NFTData): string => {
  const [mainAcc] = token.attributes.filter(item => item.trait_type === "Main Account");
  return mainAcc.value;
};
