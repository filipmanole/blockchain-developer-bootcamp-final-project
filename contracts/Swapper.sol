// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Swapper {
  event PairAdded(address token0, address token1);
  event Swapped(address token, uint ammount);
  event Withdrawn();

  constructor(address _factory) {}

  function addLiquidity(address token0, uint token0amount, address token1, uint token1amount) public {}

  function swap(address tokenIn, address tokenOut, uint amountIn, uint amountOutMin) public {}

  function withdraw() public {}

  function getAmountsOut(uint amountIn, address[] memory path) public view returns (uint[] memory amounts) {}

  function getAmountsIn(uint amountOut, address[] memory path) public view returns (uint[] memory amounts) {}
}
