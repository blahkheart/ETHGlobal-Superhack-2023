import Image from "next/image";
import type { NextPage } from "next";
import HomeHeader from "~~/components/HomeHeader";
import { MetaHeader } from "~~/components/MetaHeader";
import { useScaffoldContractWrite } from "~~/hooks/scaffold-eth";

const Mint: NextPage = () => {
  const { writeAsync: mintNft } = useScaffoldContractWrite({
    contractName: "NBANFT",
    functionName: "mintNft",
  });

  async function handleMintNft() {
    mintNft();
  }

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
          <button className="btn btn-secondly btn-lg" onClick={handleMintNft}>
            Mint Nft
          </button>
        </div>
      </section>
    </main>
  );
};

export default Mint;
