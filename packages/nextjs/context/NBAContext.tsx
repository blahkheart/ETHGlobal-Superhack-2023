import { ReactNode, createContext, useContext, useEffect, useState } from "react";
import { ethers } from "ethers";
import { useAccount } from "wagmi";
import { useDeployedContractInfo, useScaffoldContractRead } from "~~/hooks/scaffold-eth";
import { NFTData } from "~~/types/nftData";
import { useEthersProvider } from "~~/utils/scaffold-eth/ethersProvider";

interface INBAContext {
  NBACollectibles: NFTData[];
  isLoading: boolean;
}

const NBAContext = createContext<INBAContext | undefined>(undefined);

export const NBACollectibleProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [NBACollectibles, setNBACollectibles] = useState<NFTData[]>([]);
  const { address } = useAccount();
  const provider = useEthersProvider();
  const { data: nbaContract } = useDeployedContractInfo("NBA");
  const { data: nftBalance } = useScaffoldContractRead({
    contractName: "NBA",
    functionName: "balanceOf",
    args: [address],
  });

  useEffect(() => {
    if (!nbaContract || !nftBalance) return;
    const readyNBACollectibles = async () => {
      setIsLoading(true);
      const nba = new ethers.Contract(nbaContract.address, nbaContract.abi, provider);

      const collectibleUpdate = [];
      for (let tokenIndex = 0; tokenIndex < nftBalance; ++tokenIndex) {
        try {
          const tokenId = await nba.tokenOfOwnerByIndex(address, tokenIndex);
          const tokenURI = await nba.tokenURI(tokenId);
          const jsonManifestString = Buffer.from(tokenURI.substring(29), "base64").toString();
          try {
            const jsonManifest = JSON.parse(jsonManifestString);
            collectibleUpdate.push({ id: parseInt(tokenId), uri: tokenURI, owner: address, ...jsonManifest });
          } catch (err) {
            console.log(err);
          }
        } catch (err) {
          console.log(err);
        } finally {
          setIsLoading(false);
        }
      }
      //   setNBACollectibles(collectibleUpdate.reverse());
      setNBACollectibles(collectibleUpdate);
    };
    if (address) readyNBACollectibles();
  }, [nbaContract, address, nftBalance, provider]);

  return <NBAContext.Provider value={{ NBACollectibles, isLoading }}>{children}</NBAContext.Provider>;
};

export const useNBACollectible = (): INBAContext => {
  const context = useContext(NBAContext);
  if (!context) {
    throw new Error("useNBA must be used within an NBACollectibleProvider");
  }
  return context;
};
