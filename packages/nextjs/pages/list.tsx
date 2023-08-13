import Image from "next/image";
import type { NextPage } from "next";
import HomeHeader from "~~/components/HomeHeader";
import { MetaHeader } from "~~/components/MetaHeader";

const List: NextPage = () => {
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
