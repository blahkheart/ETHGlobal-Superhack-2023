import React from "react";
import Link from "next/link";
import { AiOutlineCopy } from "react-icons/ai";
import QRCode from "react-qr-code";
import PageHOC from "~~/components/superhack/PageHOC";
import SelectActiveToken from "~~/components/superhack/SelectActiveToken";
import { useAccountContext } from "~~/context/AccountContext";
import { useNBACollectible } from "~~/context/NBAContext";
import { notification } from "~~/utils/scaffold-eth";

const Deposit = () => {
  const { activeTokenMainAccount } = useAccountContext();
  const { NBACollectibles, isLoading } = useNBACollectible();
  const handleCopyAddress = (text: string) => {
    navigator.clipboard.writeText(text);
    notification.success("Copied address");
  };
  return (
    <div className=" mt-28  deposit__container  h-full">
      <div className="grid  gap-8 deposit__container-content min-h-[37.7rem]">
        <div className="bg-super-dark p-10 text-center rounded-lg ">
          <h3 className="text-[27px] mb-4">Depost</h3>
          <SelectActiveToken nbaCollectibles={NBACollectibles} type="address" />
          <p className="mb-8 mt-4 gradient-text">(Onchain Transfer)</p>
          <p>Send ETH, ERC20 tokens or NFTs to this address:</p>
          {NBACollectibles.length > 0 && (
            <div>
              <div className="bg-black p-3 mt-4 flex justify-between rounded-md">
                <p>{activeTokenMainAccount}</p>
                <button onClick={() => handleCopyAddress(activeTokenMainAccount)}>
                  <AiOutlineCopy size={18} className="" />
                </button>
              </div>
              <div className="mt-10 max-w-[200px] mx-auto">
                <QRCode
                  size={256}
                  style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                  value={activeTokenMainAccount}
                  viewBox={`0 0 256 256`}
                />
              </div>
            </div>
          )}
          {!isLoading && !NBACollectibles.length && (
            <div>
              <p className="my-8 gradient-text">YOU HAVE NO NBA COLLECTIBLE</p>
              <Link href="/mint">
                <button className="px-12 py-2 border-[1px] border-super-gradient rounded-2xl bg-black w-fit mx-auto">
                  Mint NFT
                </button>
              </Link>
            </div>
          )}
        </div>

        <div className="bg-super-dark p-10 text-center rounded-lg min-h-[37.7rem] flex flex-col">
          <div>
            <h3 className="text-[27px] mb-4">Fiat Currency</h3>
            <p className="mb-8 gradient-text">CREDIT CARD & BANK TRANSFER</p>
            <div className="max-w-[380px] mx-auto">
              <p>Deposit with credit card or bank transfer with one of our trusted partners</p>
            </div>
          </div>

          <div className="flex-1 bg-black p-3 mt-4 flex justify-between items-center rounded-lg">
            <div className="max-w-[300px] mx-auto">
              <p className="text-[24px]">There are no Fiat currencies available yet</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PageHOC(Deposit);
