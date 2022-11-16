//SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;
import "./PriceConverter.sol";
import "hardhat/console.sol"; //this allows us to use console.log in the solidity


//Using custom errors can minimize u a more gas costs
error notOwner();

///@title this is a contract named FundMe
///@author Mulugeta



contract FundMe{
  using PriceConverter for uint256;
    // You should use constant and immutable keyword for the variable inorder to save gases
    //also making your state variables internal and public saves you gases so we make state variable public and we'll set  getter function for all of them
    uint256 public constant minimumUsd = 0;
    address[] public addressOfFunders;
    mapping(address => uint256) public addressToAmountFunded;
    address public immutable i_owner;
    AggregatorV3Interface public priceFeed;

    //when u set state variables, it cost us more gases because it is stored in storage...so making then to change
    //to memory would cost us less gas

    constructor(address priceFeedAddress){
      i_owner = msg.sender;
      priceFeed = AggregatorV3Interface(priceFeedAddress);
    }
    function fund() public payable{

        require(msg.value.getConversionRate(priceFeed) >= minimumUsd, "Didnt fulfill the bare minimum");
        addressToAmountFunded[msg.sender] += msg.value;
        addressOfFunders.push(msg.sender);
    }
     // the naming convention for the immutable is i_stgElse
    //you should use immutable keyword if the declaration of the variable doesn't instantiate its value like this one and also it saves as a more gas



    function withdraw() public onlyOwner{
        for(uint256 i = 0; i < addressOfFunders.length; i++){
          //addressToAmountFunded[addressOfFunders[i]] = 0;
          address funder = addressOfFunders[i];
          addressToAmountFunded[funder] = 0;
        }
        addressOfFunders = new address[](0);
      

      //to send etherium by using call but there are other methods like transfer and send
       (bool callSuccess, )= payable(msg.sender).call{value: address(this).balance}("");
       require(callSuccess, "call failed");
    }
    //writing cheaper withdraw function
    function cheaperWithDraw() public onlyOwner{
      address[] memory funders = addressOfFunders;
      for(uint256 i = 0; i < funders.length; i++){
        address funder = funders[i];
        addressToAmountFunded[funder] = 0;
      }

      funders = new address[](0);
      (bool callSuccess, )= payable(msg.sender).call{value: address(this).balance}("");
       require(callSuccess, "call failed");

    }

    modifier onlyOwner() {
      //require(i_owner == msg.sender, "sender is not owner");
      if(i_owner != msg.sender){
        revert notOwner();
      }
      _;
    }

    receive() external payable{
      fund();
    }

    fallback() external payable{
      fund();
    }
    function getAddressOfFunders(uint256 index) public view returns(address){
      return addressOfFunders[index];
    }
    function getAddressToAmountFunded(address addre) public view returns(uint256){
      return addressToAmountFunded[addre];
    }
    function getOwner() public view returns(address){
      return i_owner;
    }
    function getPriceFeed() public view returns(AggregatorV3Interface){
      return priceFeed;
    }
}