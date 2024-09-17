import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "dotenv/config";

const config: HardhatUserConfig = {
  solidity: "0.8.24",
  networks: {
    sepolia_testnet: {
      url: `https://ethereum-sepolia-rpc.publicnode.com`,
      accounts: [`0x${process.env.PRIVATE_KEY}`] // Add `0x` here
    }
  }
};

export default config;
