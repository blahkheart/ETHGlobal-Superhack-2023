import Image from "next/image";
import Link from "next/link";
import type { NextPage } from "next";
import HomeHeader from "~~/components/HomeHeader";
import { MetaHeader } from "~~/components/MetaHeader";

const Home: NextPage = () => {
  return (
    <main className="bg-[#221e29]">
      <MetaHeader />
      <HomeHeader />
      <section>
        <div className="container mx-auto my-24 flex flex-wrap px-8 md:px-0">
          <div className="w-full md:w-3/5 md:text-left text-center mb-12 md:mb-2">
            <p className="md:text-2xl uppercase font-bold mb-4 md:capitalize md:font-normal">The future of NFT</p>
            <h1 className="md:text-5xl text-4xl leading-[1.5] md:leading-[1.5] font-[600] gradient-text">
              <span className="default-text">The Web3 Wallet That is </span>User- Friendly and Secure{" "}
              <span className="default-text">for Effortless Self-Custody</span>
            </h1>
            <Link href="/dashboard" className="rainbow-btn">
              <span>Go to app</span>
            </Link>
          </div>
          <div className="w-full md:w-2/5 ">
            <div className="w-full transform md:scale-110 scale-90 flex items-center justify-center">
              <Image src={"/assets/hero-image.png"} width={415} height={427} alt="hero-image"></Image>
            </div>
          </div>
        </div>
        <div className="text-center text-xl">
          <p className="inline border-l border-r px-16 py-4">Built on Account Abstraction</p>
        </div>
      </section>
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

          <p className="text-4xl md:w-[55%] leading-[1.7] font-[500]">
            An ERC721 Bound Smart Wallet With Account Abstraction Capabilities
          </p>
          <div className="mt-6">
            <Link href="/dashboard" className="rainbow-btn">
              <span>Go to app</span>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Home;
