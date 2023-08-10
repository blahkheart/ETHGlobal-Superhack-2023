import React from "react";
import { BiPlus } from "react-icons/bi";
import PageHOC from "~~/components/superhack/PageHOC";

const Dashboard = () => {
  return (
    <div className="dashboard__container m-10">
      <div className=" dashboard__container-content ">
        <div className="bg-super-dark p-8 min-h-[246px] rounded">
          <p className="text-xl">Accout 1</p>
          <div className="mt-8 px-3">
            <div className="grid grid-flow-col justify-start gap-4 mb-6">
              <div>
                <img src="/images/eth.png" alt="user image" />
              </div>
              <div className="grid justify-between">
                <p>Address</p>
                <p className="text-[2.2 rem]">0x0000000 ... 000000</p>
              </div>
            </div>
            <div className="grid gap-2 items-center justify-between grid-flow-col">
              <div>
                <p>Balance</p>
                <p className="text-[2.2rem] ">$0.00</p>
              </div>
              <div>
                <p>Token Balance</p>
                <p className="text-[2.2rem] ">--</p>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-super-dark p-8 grid min-h-[256px] rounded justify-center items-center ">
          <div className=" grid gap-3">
            <p className="grid justify-center ">
              {" "}
              <BiPlus size={35} />
            </p>
            <p className="text-xl">Create Wallet</p>
          </div>
        </div>
      </div>
      <div>
        <div className="mt-8 rounded bg-super-dark ">
          <div className="grid sm:grid-cols-2 ">
            <div className="text-center py-8 border-b-[3px] border-super-gradient">
              <p className="text-[1.8rem]">My Tokens</p>
            </div>
            <div className="text-center py-8 border-b-[3px] border-gray-600">
              <p className="text-[1.8rem]">All Tokens</p>
            </div>
          </div>
          <div className="grid justify-center  items-center min-h-[485px]">
            <div className="grid gap-8 justify-center">
              <p className="text-[1.8rem]">You don’t have any funds on this account</p>
              <button className="px-12 py-5 border-[1px] border-super-gradient rounded-2xl bg-black w-fit mx-auto">
                {" "}
                Deposit
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PageHOC(Dashboard);
