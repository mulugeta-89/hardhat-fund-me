// module.exports = async (hre) => {
//   const deployments = hre.deployments;
//   const getNamedAccounts = hre.getNamedAccounts;

//   const { deploy, log } = deployments;
//   const { deployer } = getNamedAccounts;
// };
//the above code is the same like this

const {
  networkConfig,
  developmentChains,
} = require("../helper-hardhat-config");

// const network = require("../helper-hardhat-config");
// const networkConfing = network.networkConfig;
// This 2 lines describe the same thing as the line 10
const { ethers } = require("hardhat");
module.exports = async ({ deployments, getNamedAccounts }) => {
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();
  const chainId = network.config.chainId;

  let ethUsdPriceFeedAddress;

  if (chainId == 31337) {
    const localAddress = await ethers.getContract("MockV3Aggregator");
    ethUsdPriceFeedAddress = localAddress.address;
  } else {
    ethUsdPriceFeedAddress = networkConfig[chainId]["ethUsdAddress"];
  }

  const fundMe = await deploy("FundMe", {
    from: deployer,
    args: [ethUsdPriceFeedAddress], // put here the price feed address because it needs to be added here for the constructor of FundMe contract
    log: true,
  });
  console.log(`The address for the contract is ${fundMe.address}`);
};

module.exports.tags = ["all", "fundme"];
