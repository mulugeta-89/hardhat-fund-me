const { getNamedAccounts, ethers } = require("hardhat");

async function main() {
  const deployer = await getNamedAccounts();
  const fundMe = await ethers.getContract("FundMe", deployer);
  console.log("deploying Fund me.....................");
  const transactionResponse = fundMe.fund({
    value: ethers.utils.parseEther("0.1"),
  });
  await transactionResponse.wait(1);
  console.log("Done...............");
}
main()
  .then(() => process.exit(0))
  .catch((err) => console.error(err));
