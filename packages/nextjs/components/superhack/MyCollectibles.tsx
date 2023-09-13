import React from "react";
import Image from "next/image";
import { Spinner } from "../Spinner";
import { useNBACollectible } from "~~/context/NBAContext";
import { getMainAccountFromTokenAttribute } from "~~/utils/account/getMainAccountFromTokenAttribute";
import { truncateAddress } from "~~/utils/account/truncateAddress";

interface IMyCollectibles {
  imageWidth: number;
  imageHeight: number;
  displayMainAccount: boolean;
}
const MyCollectibles: React.FC<IMyCollectibles> = ({ imageWidth, imageHeight, displayMainAccount }) => {
  const { NBACollectibles, isLoading } = useNBACollectible();

  return (
    <>
      {!NBACollectibles ||
        (isLoading && (
          <div className="container flex flex-col mx-auto py-32 items-center justify-center text-center">
            <div className="mb-6">
              <Spinner />
            </div>
            <p> Loading... </p>
          </div>
        ))}
      {NBACollectibles.length === 0 && !isLoading && (
        <div className="container flex flex-col mx-auto py-32 items-center justify-center text-center">
          <div className="mb-6">
            <Image src={"/assets/erc.png"} width={136} height={136} alt="erc logo" />
          </div>
          <p> You have no NFT </p>
        </div>
      )}

      <div className="grid grid-cols-3">
        {NBACollectibles.length > 0 &&
          NBACollectibles.map(item => (
            <div key={item.id} className="text-center mb-4 flex items-center justify-center flex-col">
              <div className="my-2 rounded-lg">
                <Image src={item.image} alt="nft" width={imageWidth} height={imageHeight} />
              </div>
              <span>{item.name}</span>
              {displayMainAccount && (
                <p className="text-xs text-gray-500">{truncateAddress(getMainAccountFromTokenAttribute(item))}</p>
              )}
            </div>
          ))}
      </div>
    </>
  );
};

export default MyCollectibles;
