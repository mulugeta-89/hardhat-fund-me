// the main difference between staging and unit test is...............
//unit test is for testing small or minimal lines of code
//staging test is for the the whole contract

const { assert, expect } = require("chai");
const { deployments, ethers, getNamedAccounts } = require("hardhat");

describe("fundMe", async () => {
  let fundMe, MockV3Aggregator;
  let sendValue = "10000000000000000"; //ethers.utils.parseEther("1"); // this changes the amoung entered to its WEI amount
  const deployer = await getNamedAccounts();
  beforeEach(async function () {
    const { deployer } = await getNamedAccounts();
    await deployments.fixture(["all"]); // this makes all the files that are found in the Deploy folder will run
    fundMe = await ethers.getContract("FundMe", deployer);
    MockV3Aggregator = await ethers.getContract("MockV3Aggregator", deployer);
  });
  describe("constructor", async () => {
    it("it sets the aggregator address corectly", async () => {
      const response = await fundMe.priceFeed();
      assert.equal(response, MockV3Aggregator.address);
    });
  });
  describe("fundMe func", async function () {
    it("Fails if you send small ETH", async () => {
      await fundMe.fund();
    });
    it("update the Address to Amount funded data structure", async () => {
      await fundMe.fund({ value: sendValue });
      const response = await fundMe.addressToAmountFunded(deployer);
      assert.equal(response.toString(), sendValue.toString());
    });
    it("adds funder to the funders array", async () => {
      await fundMe.fund({ value: sendValue });
      const funder = await fundMe.addressOfFunders(0);
      assert.equal(funder, deployer);
      console.log(funder);
    });
  });

  describe("withdraw", async function () {
    beforeEach("fund", async function () {
      await fundMe.fund({ value: sendValue });
    });
    it("withdraw ETH from a single account", async function () {
      const startingFundMeBalance = await fundMe.provider.getBalance(
        fundMe.address
      );
      const startingDeployerBalance = await fundMe.provider.getBalance(
        deployer
      );

      const transactionResponse = await fundMe.withdraw();
      const transactionReceipt = await transactionResponse.wait(1);
      console.log(transactionReceipt);

      const { gasUsed, effectiveGasPrice } = transactionReceipt;
      const gasCost = gasUsed.mul(effectiveGasPrice);

      const endingFundMeBalance = await fundMe.provider.getBalance(
        fundMe.address
      );
      const endingDeployerBalance = await fundMe.provider.getBalance(deployer);

      assert(endingDeployerBalance, 0);
      assert(
        startingDeployerBalance.add(startingFundMeBalance).toString(),
        endingFundMeBalance.add(gasCost).toString()
      );
    });
  });
});
