//SPDX-License-Identifier: MIT

pragma solidity ^0.8.7;
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

library PriceConverter{
    function getPrice(AggregatorV3Interface priceFeed) internal view returns(uint256) {
        // address 0xD4a33860578De61DBAbDc8BFdb98FD742fA7028e 
        //ABI
        (, int256 price,,,) = priceFeed.latestRoundData();
        return uint256(price * 1e10);

    } 
    function getVersion() internal view returns(uint256){
        AggregatorV3Interface priceFeed = AggregatorV3Interface(0xD4a33860578De61DBAbDc8BFdb98FD742fA7028e);
        return priceFeed.version();
    }
    function getConversionRate(uint256 ethAmount, AggregatorV3Interface priceFeed) internal view returns(uint256){
      uint256 ethPrice = getPrice(priceFeed);
      uint256 amountInUsd = (ethAmount * ethPrice) / 1e18;
      return amountInUsd;
    } 

}