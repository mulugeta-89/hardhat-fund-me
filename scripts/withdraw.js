const { getNamedAccounts, ethers } = require("hardhat");
async function main() {
  const deployer = await getNamedAccounts();
  const fundMe = await ethers.getContract("FundMe", deployer);
  console.log("deploying withdraw..............");

  const transactionResponse = await fundMe.withDraw();
  await transactionResponse.wait(1);

  console.log("done.........................");
}
main()
  .then(() => process.exit(1))
  .catch((err) => console.error(err));
