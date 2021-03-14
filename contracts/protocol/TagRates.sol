//SPDX-License-Identifier: Unlicense
pragma solidity ^0.7.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/math/SafeMath.sol";
import "@chainlink/contracts/src/v0.6/interfaces/AggregatorV3Interface.sol";

contract TagRates is Ownable {
    using SafeMath for uint256;

    address private chainLinkAddress;

    AggregatorV3Interface internal FeedContract;

    uint256 private staticRate;

    bool private byPassCL;

    uint256 private baserate;

    constructor () Ownable() public {
        byPassCL = true;
    }

    function fetchCL ( ) view public returns (address) {
        return chainLinkAddress;
    }

    function fetchType ( ) view public returns ( bool ) {
        return byPassCL;
    }

    function fetchBaserate ( ) view public returns ( uint256 ) {
        return baserate;
    }

    function fetchStaticrate ( ) view public returns ( uint256 ) {
        return staticRate;
    }

    function setChainLinkAddress ( address _addr ) onlyOwner public returns (bool) {
        chainLinkAddress = _addr;
        FeedContract = AggregatorV3Interface(_addr);
        return true;
    }

    function setStaticRate ( uint256 _rate ) onlyOwner public returns (bool) {
        staticRate = _rate;
        return true;
    }

    function EnableChainLink ( ) onlyOwner public returns (bool) {
         byPassCL = true;
        return true;
    }

    function DisableChainLink (  ) onlyOwner public returns (bool) {
        byPassCL = false;
        return true;
    }

    function setBaseRate ( uint256 _rate ) onlyOwner public returns (bool) {
        baserate = _rate;
        return true;
    }

    function fetchPrice() public view returns ( uint256 ) {
        if( byPassCL == false ){
            return staticRate;
        }else{
            (  , int p ,  ,  ,  ) = FeedContract.latestRoundData();
            uint256 price = uint256(p);
            return (baserate.mul(10**18)).div(price).mul(10**8);
        }
    }

}
