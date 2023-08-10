import React from "react";
import { useRouter } from "next/router";
import { BiCalendar, BiSolidDashboard, BiTransfer } from "react-icons/bi";
import { MdOutlineSavings } from "react-icons/md";

const Sidebar = () => {
  const router = useRouter();
  const sidebarList = [
    {
      name: "Dashboard",
      icon: <BiSolidDashboard size={24} className="" />,
      path: "/dashboard",
    },
    {
      name: "Transfer",
      icon: <BiTransfer size={24} className="" />,
      path: "/transfer",
    },
    {
      name: "Deposit",
      icon: <MdOutlineSavings size={24} className="" />,
      path: "/deposit",
    },
    {
      name: "Transactions",
      icon: <BiCalendar size={24} className="" />,
      path: "/transactions",
    },
  ];
  return (
    <div className="pl-3 md:pl-6 bg-[#1F1E27] w-fit sm:min-w-[220px] max-w-[306px] h-full">
      <div className="mt-7">Logo</div>

      <ul className="mt-10 ">
        {sidebarList.map((item, index) => (
          <li
            key={index}
            className={`hover:bg-active py-3 mb-2 cursor-pointer flex items-center gap-4 ${
              router.pathname === item.path ? "bg-active" : ""
            }`}
            onClick={() => router.push(item.path)}
          >
            {item.icon}
            <p className="hidden sm:block ">{item.name}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
