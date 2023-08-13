import React from "react";
import Image from "next/image";
import Link from "next/link";

const HomeHeader = () => {
  return (
    <header>
      <div className=" py-8 pt-10 flex justify-between container mx-auto">
        <div>
          <Image width={135} height={46} src={"/assets/logo.svg"} alt="NBA logo" />
        </div>
        <Link href="/dashboard" className="rainbow-btn small w-[10rem]">
          <span>Go to app</span>
        </Link>
      </div>
    </header>
  );
};

export default HomeHeader;
