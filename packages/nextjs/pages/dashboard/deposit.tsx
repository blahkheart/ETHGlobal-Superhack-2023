import React from "react";
import { AiOutlineCopy } from "react-icons/ai";
import QRCode from "react-qr-code";
import { useAccount } from "wagmi";
import PageHOC from "~~/components/superhack/PageHOC";
import { useAccountContext } from "~~/context/AccountContext";

const Deposit = () => {
  const { accountAddress } = useAccountContext();
  const { address } = useAccount();
  console.log(accountAddress);

  return (
    <div className=" mt-28  deposit__container  h-full">
      <div className="grid  gap-8 deposit__container-content min-h-[37.7rem]">
        <div className="bg-super-dark p-10 text-center rounded-lg ">
          <h3 className="text-[27px] mb-4">Depost</h3>
          <p className="mb-8 gradient-text">(DIRECT TRANSFER)</p>
          <p>Send ETH, tokens or collectables (NFTs) to this address:</p>
          <div className="bg-black p-3 mt-4 flex justify-between rounded-md">
            <p>{accountAddress ? accountAddress?.toString() : address?.toString() || ""}</p>
            <AiOutlineCopy size={18} className="" />
          </div>

          <div className="mt-10 max-w-[200px] mx-auto">
            <QRCode
              size={256}
              style={{ height: "auto", maxWidth: "100%", width: "100%" }}
              value={accountAddress ? accountAddress?.toString() : address?.toString() || ""}
              viewBox={`0 0 256 256`}
            />
          </div>
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
