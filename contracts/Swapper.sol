// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import '@openzeppelin/contracts/access/Ownable.sol';

import '@uniswap/v2-periphery/contracts/interfaces/IWETH.sol';
import '@uniswap/v2-core/contracts/interfaces/IUniswapV2Factory.sol';
import '@uniswap/v2-periphery/contracts/interfaces/IERC20.sol';
import '@uniswap/v2-periphery/contracts/interfaces/IUniswapV2Router02.sol';

contract Swapper is Ownable { 
  uint private tokensLen;
  mapping(uint => address) private tokens;
  mapping(address => bool) private exist;

  IUniswapV2Factory public immutable factory;
  IUniswapV2Router02 public immutable router;
  IWETH public immutable WETH;

  event PairAdded(uint token0amount, uint token1amount, uint liquidity);
  event SwappedExactInput();
  event Withdrawn();

  constructor(address _factory, address _router) {
    factory = IUniswapV2Factory(_factory);
    router = IUniswapV2Router02(_router);
    WETH = IWETH(router.WETH());

    tokensLen = 0;
  }

  function markToken(address token) private {
    if(exist[token] == true) return;

    tokens[tokensLen] = token;
    tokensLen = tokensLen + 1;
    exist[token] = true;
  }

  function addLiquidity(address token0, uint token0amount, address token1, uint token1amount) public {
    require(IERC20(token0).transferFrom(msg.sender, address(this), token0amount), 'transfer failed');
    require(IERC20(token1).transferFrom(msg.sender, address(this), token1amount), 'transfer failed');

    require(IERC20(token0).approve(address(router), token0amount), 'approve failed');
    require(IERC20(token1).approve(address(router), token1amount), 'approve failed');

    (uint amount0, uint amount1, uint liquidity) = 
      router.addLiquidity(token0, token1, token0amount, token1amount, 1, 1, address(this), block.timestamp);

    emit PairAdded(amount0, amount1, liquidity);
  }

  function swapExactTokensIn(address tokenIn, address tokenOut, uint amountIn, uint amountOutMin) public {
    require(IERC20(tokenIn).transferFrom(msg.sender, address(this), amountIn), 'transfer failed');

    uint newAmountIn = amountIn * 9 / 10;
    require(IERC20(tokenIn).approve(address(router), newAmountIn), 'approve failed');
    
    address[] memory path = new address[](2);
    path[0] = tokenIn;
    path[1] = tokenOut;
    router.swapExactTokensForTokens(newAmountIn, amountOutMin, path, msg.sender, block.timestamp);
  
    markToken(tokenIn);

    emit SwappedExactInput();
  }

  function withdraw() onlyOwner public {
    for(uint i = 0; i < tokensLen; i++) {
      uint balance = IERC20(tokens[i]).balanceOf(address(this));
      IERC20(tokens[i]).transfer(owner(), balance);

      delete exist[tokens[i]];
      delete tokens[i];
    }
    tokensLen = 0;

    emit Withdrawn();
  }

  function getAmountsOut(uint amountIn, address[] memory path) public view returns (uint[] memory amounts) {
    uint[] memory _amounts =  router.getAmountsOut(amountIn * 9 / 10, path);
    _amounts[0] = amountIn;

    return _amounts;
  }

  function getAmountsIn(uint amountOut, address[] memory path) public view returns (uint[] memory amounts) {
    uint[] memory _amounts = router.getAmountsIn(amountOut, path);
    _amounts[0] = _amounts[0] + _amounts[0] / 10;
    
    return _amounts;
  }
}
