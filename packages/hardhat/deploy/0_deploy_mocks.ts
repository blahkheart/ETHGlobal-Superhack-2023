import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { MOCK_TOKEN_LIST } from "../helpers/constants";
import { ethers } from "hardhat";

/**
 * Deploys a contract named "YourContract" using the deployer account and
 * constructor arguments set to the deployer address
 *
 * @param hre HardhatRuntimeEnvironment object.
 */
const deployMocks: DeployFunction = async function ({ deployments }: HardhatRuntimeEnvironment) {
  const { log } = deployments;
  // Should Only Deploy Mock If it Local Network
  const provider = ethers.provider;
  const from = await provider.getSigner().getAddress();

  for (const key in MOCK_TOKEN_LIST) {
    if (key === "ETH") continue;
    const token = await deployments.deploy("Token", {
      from,
      args: [key, MOCK_TOKEN_LIST[key]],
      gasLimit: 6e6,
      deterministicDeployment: true,
    });
    console.log(`deployed Token ${key} ${MOCK_TOKEN_LIST[key]} addr== ${token.address}`);
  }
  log("Done \n \n");
};

export default deployMocks;
