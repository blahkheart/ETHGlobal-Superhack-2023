import Image from "next/image";
import Link from "next/link";
import type { NextPage } from "next";
import { MetaHeader } from "~~/components/MetaHeader";

const Home: NextPage = () => {
  return (
    <>
      <MetaHeader />
      <section>
        <div className="container mx-auto my-24 flex">
          <div className="w-3/5">
            <p className="text-2xl">The future of NFT</p>
            <h1 className="text-5xl leading-[1.5] font-[600] gradient-text">
              <span className="default-text">The Web3 Wallet That is </span>User- Friendly and Secure{" "}
              <span className="default-text">for Effortless Self-Custody</span>
            </h1>
            <Link href="/">Go to app </Link>
          </div>
          <div className="w-2/5">
            <div className="w-full transform scale-110 ml-24">
              <Image src={"/assets/hero-image.png"} width={415} height={427} alt="hero-image"></Image>
            </div>
          </div>
        </div>
        <div className="text-center text-xl">
          <p className="inline border-l border-r px-16 py-4">Built on Account Abstraction</p>
        </div>
      </section>
      <section>
        <div className="container flex flex-col mx-auto my-32 items-center justify-center text-center">
          <div className="mb-6">
            <Image src={"/assets/erc.png"} width={136} height={136} alt="erc logo" />
          </div>

          <p className="text-4xl md:w-[55%] leading-[1.7] font-[500]">
            An ERC721 Bound Smart Wallet With Account Abstraction Capabilities
          </p>
        </div>
      </section>
    </>
  );
};

export default Home;
