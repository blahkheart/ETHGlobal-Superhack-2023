import { ethers } from "ethers";
import { IPresetBuilderOpts, Presets } from "userop";

const config = {
  rpcUrl: `https://api.stackup.sh/v1/node/266d1daf17a6f6e6ff17f4546c7807f1cacce001f66de3f5a9d254d01cad1765`,
  signingKey: "",
  entryPoint: "0xF3451a5836015FfC5C42cAe23F3283b68458c912",
  accountFactory: "0xD617C27B3c3372d84285B158d265F255417738cF",
  paymaster: {
    rpcUrl: "https://api.stackup.sh/v1/paymaster/266d1daf17a6f6e6ff17f4546c7807f1cacce001f66de3f5a9d254d01cad1765",
    context: { type: "payg" },
  },
};

export async function initWallet(): Promise<string> {
  try {
    const opts: IPresetBuilderOpts = { entryPoint: config.entryPoint, factory: config.accountFactory };
    const privateKey = new ethers.Wallet(ethers.utils.randomBytes(32));
    console.log(privateKey);
    const account = await Presets.Builder.SimpleAccount.init(privateKey, config.rpcUrl, opts);
    const address = account.getSender();
    console.log(`Account address: ${address}`);
    return address;
  } catch (error) {
    console.log(error);
    return "";
  }
}
