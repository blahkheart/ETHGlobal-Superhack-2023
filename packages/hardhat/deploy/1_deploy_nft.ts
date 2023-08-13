import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import fs from "fs";
import { ethers } from "hardhat";

/**
 * Deploys a contract named "YourContract" using the deployer account and
 * constructor arguments set to the deployer address
 *
 * @param hre HardhatRuntimeEnvironment object.
 */
const deployMocks: DeployFunction = async function ({ deployments }: HardhatRuntimeEnvironment) {
  const { log } = deployments;
  const provider = ethers.provider;
  const from = await provider.getSigner().getAddress();
  const nftImage = fs.readFileSync("./images/svgImage.svg", { encoding: "utf8" });

  const nftContract = await deployments.deploy("NBANFT", {
    from,
    args: [nftImage],
    gasLimit: 6e6,
  });
  console.log(`deployed NFT addr== ${nftContract.address}`);
  log("Done \n \n");
};

export default deployMocks;
