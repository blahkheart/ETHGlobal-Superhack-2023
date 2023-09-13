import type { NextPage } from "next";
import HomeHeader from "~~/components/HomeHeader";
import { MetaHeader } from "~~/components/MetaHeader";
import MyCollectibles from "~~/components/superhack/MyCollectibles";

const List: NextPage = () => {
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
        <MyCollectibles imageWidth={250} imageHeight={200} displayMainAccount={false} />
      </section>
    </main>
  );
};

export default List;
