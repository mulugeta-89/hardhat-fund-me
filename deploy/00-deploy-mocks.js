const {
  developmentChains,
  DECIMALS,
  INITIAL_ANSWER,
} = require("../helper-hardhat-config");

const { network, hre } = require("hardhat");

module.exports = async ({ deployments, getNamedAccounts }) => {
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();
  const chainId = network.config.chainId;

  if (developmentChains.includes(network.name)) {
    log("Deploying on local network or on the hardhat.............THE MOCK");
    const localDeploy = await deploy("MockV3Aggregator", {
      contract: "MockV3Aggregator",
      from: deployer,
      log: true,
      args: [DECIMALS, INITIAL_ANSWER],
    });
    log("mocks Deployed");
    log(
      "************************************************************************************"
    );
    log(localDeploy.address);
  }
};
module.exports.tags = ["all", "mocks"];
// const { network, ethers } = require("hardhat");
// const { developmentChains, DECIMALS } = require("../helper-hardhat-config");

// const BASE_FEE = "250000000000000000";
// const GAS_PRICE_LINK = 1e9;

// module.exports = async function ({ getNamedAccounts, deployments }) {
//   const { deploy, log } = deployments;
//   const { deployer } = await getNamedAccounts();
//   const chainId = network.config.chainId;
//   const args = [BASE_FEE, GAS_PRICE_LINK]

//   if (chainId == 31337) {
//     log("Local network detected! Deploying Mock...");

//     await deploy("MockV3Aggregator", {
//       from: deployer,
//       log: true,
//       args: [BASE_FEE, GAS_PRICE_LINK],
//     });
//   }
//   log("MOCK DEPOYED......!");
//   log("------------------------------------");
// };

// module.exports.tags = ["all", "mocks"];
