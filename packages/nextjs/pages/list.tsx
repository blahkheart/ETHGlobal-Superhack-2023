import Image from "next/image";
import type { NextPage } from "next";
import HomeHeader from "~~/components/HomeHeader";
import { MetaHeader } from "~~/components/MetaHeader";
import { Spinner } from "~~/components/Spinner";
import { useNBACollectible } from "~~/context/NBAContext";

const List: NextPage = () => {
  const { NBACollectibles, isLoading } = useNBACollectible();

  return (
    <main className="bg-[#221e29]">
      <MetaHeader />
      <HomeHeader />
      <section
        className="bg-contain bg-bottom mt-16 pb-16"
        style={{
          background: `url("/assets/bg1.png")`,
          backgroundPositionY: "bottom",
          backgroundSize: "contain",
          backgroundPositionX: "center",
        }}
      >
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
                  <Image src={item.image} alt="nft" width={250} height={200} />
                </div>
                <span>{item.name}</span>
              </div>
            ))}
        </div>
      </section>
    </main>
  );
};

export default List;
