require("@nomicfoundation/hardhat-toolbox");

require("hardhat-deploy");
require("dotenv").config();

const goerli_RPC_URL = process.env.GOERLI_RPC_URL;
const PRIVATE_KEY = process.env.PRIVATE_KEY;

/** @type import('hardhat/config').HardhatUserConfig */
(
  module.exports = {
    solidity: {
      compilers: [{ version: "0.8.8" }, { version: "0.6.6" }],
    },
    networks: {
      goerli: {
        url: goerli_RPC_URL,
        accounts: [PRIVATE_KEY],
        chainId: 5,
      },
      localhost: {
        url: "http://127.0.0.1:8545/",
        chainId: 31337,
      },
    },
    namedAccounts: {
      deployer: {
        default: 0, // here this will by default take the first account as deployer
      },
    },
  }
);
