import React from "react";
import { useAccountContext } from "~~/context/AccountContext";
import { NFTData } from "~~/types/nftData";
import { getMainAccountFromTokenAttribute } from "~~/utils/account/getMainAccountFromTokenAttribute";
import { truncateAddress } from "~~/utils/account/truncateAddress";

interface ISelectActiveToken {
  nbaCollectibles: NFTData[];
  type: "name" | "address";
}

const SelectActiveToken: React.FC<ISelectActiveToken> = ({ nbaCollectibles, type }) => {
  const { setActiveToken, activeTokenMainAccount } = useAccountContext();

  const handleSelectActiveToken = (e: any) => {
    const _tokenId = parseInt(e.target.value);
    const selectedToken = nbaCollectibles.filter(token => token.id === _tokenId);
    setActiveToken(selectedToken);
  };

  if (nbaCollectibles.length === 0)
    return (
      <div className="animate-pulse flex space-x-4">
        <div className="rounded-md bg-slate-300 h-6 w-6"></div>
        <div className="flex items-center space-y-6">
          <div className="h-2 w-28 bg-slate-300 rounded"></div>
        </div>
      </div>
    );

  return (
    <select className="select select-xs select-ghost bg-transparent" onChange={handleSelectActiveToken}>
      <option value={"Select token"}>Select token</option>
      {nbaCollectibles.map(item => (
        <option value={item.id} key={item.id} defaultValue={activeTokenMainAccount}>
          {type === "name" ? item.name : truncateAddress(getMainAccountFromTokenAttribute(item))}
        </option>
      ))}
    </select>
  );
};

export default SelectActiveToken;
