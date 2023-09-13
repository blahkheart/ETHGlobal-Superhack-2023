import { useEffect, useState } from "react";
import Image from "next/image";
import { ethers } from "ethers";
import type { NextPage } from "next";
import { useAccount } from "wagmi";
// import { alchemyProvider } from "wagmi/providers/alchemy";
import HomeHeader from "~~/components/HomeHeader";
import { MetaHeader } from "~~/components/MetaHeader";
import { useDeployedContractInfo, useScaffoldContractRead } from "~~/hooks/scaffold-eth";
import { useEthersProvider } from "~~/utils/scaffold-eth/ethersProvider";


const List: NextPage = () => {
  const [tokenId, setTokenId] = useState(1);
  // const [quantity, setQuantity] = useState(1);
  const [NBACollectibles, setNBACollectibles] = useState([]);
  const { address } = useAccount();
  const provider = useEthersProvider();
  const { data: nbaContract } = useDeployedContractInfo("NBA");

  const { data: nftBalance, isLoading: isLoadingBalanceOf } = useScaffoldContractRead({
    contractName: "NBA",
    functionName: "balanceOf",
    args: [address],
  });
  console.log("BAL::", nftBalance);

  useEffect(() => {
    if (!nbaContract || !nftBalance) return;
    const test = async () => {
      const nba = new ethers.Contract(nbaContract.address, nbaContract.abi, provider);
      const collectibleUpdate = [];
      for (let tokenIndex = 0; tokenIndex < nftBalance; ++tokenIndex) {
        try {
          console.log("Getting token index " + tokenIndex);
          const tokenId = await nba.tokenOfOwnerByIndex(address, tokenIndex);
          console.log("tokenId: " + tokenId);
          const tokenURI = await nba.tokenURI(tokenId);
          const jsonManifestString = Buffer.from(tokenURI.substring(29), "base64").toString();
          console.log("jsonManifestString: " + jsonManifestString);
          try {
            const jsonManifest = JSON.parse(jsonManifestString);
            console.log("jsonManifest: " + jsonManifest);
            collectibleUpdate.push({ id: tokenId, uri: tokenURI, owner: address, ...jsonManifest });
          } catch (err) {
            console.log(err);
          }
        } catch (err) {
          console.log(err);
        }
      }
      setNBACollectibles(collectibleUpdate.reverse());
    };
    if (address) test();
  }, [nbaContract, address, nftBalance]);

  return (
    <main className="bg-[#221e29]">
      <MetaHeader />
      <HomeHeader />
      <section
        className="bg-contain bg-bottom mt-16 pb-16 pt-10"
        style={{
          background: `url("/assets/bg1.png")`,
          backgroundPositionY: "bottom",
          backgroundSize: "contain",
          backgroundPositionX: "center",
        }}
      >
        <div className="container flex flex-col mx-auto py-32 items-center justify-center text-center">
          <div className="mb-6">
            <Image src={"/assets/erc.png"} width={136} height={136} alt="erc logo" />
          </div>
          <p> List of nfts </p>
        </div>
      </section>
    </main>
  );
};

export default List;