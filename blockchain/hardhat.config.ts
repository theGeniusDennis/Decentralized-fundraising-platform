import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "dotenv/config";
import {vars} from "hardhat/config";
import "@nomicfoundation/hardhat-verify";

const ETHERSCAN_API_KEY  = vars.get("ETHERSCAN_API_KEY");

const config: HardhatUserConfig = {
  solidity: "0.8.24",
  networks: {
    sepolia: {
      url: `https://ethereum-sepolia-rpc.publicnode.com`,
      accounts: [`0x${process.env.PRIVATE_KEY}`] // Add `0x` here
    }
  }, 
  etherscan: {
    apiKey: {
      sepolia: ETHERSCAN_API_KEY
    }
  },
  sourcify: {
    enabled: true
  }


};

export default config;
