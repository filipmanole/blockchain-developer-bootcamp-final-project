// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "hardhat/console.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

import "@uniswap/v2-periphery/contracts/interfaces/IWETH.sol";
import "@uniswap/v2-periphery/contracts/interfaces/IERC20.sol";
import "@uniswap/v2-periphery/contracts/interfaces/IUniswapV2Router02.sol";
import "@uniswap/v2-core/contracts/interfaces/IUniswapV2Factory.sol";
import "@uniswap/v2-core/contracts/interfaces/IUniswapV2Pair.sol";

contract Swapper is Ownable {
  mapping(address => address[]) public lpTokens;
  mapping(address => string) public lpTokenNames;

  uint256 private tokensLen;
  mapping(uint256 => address) private tokens;
  mapping(address => bool) private exist;

  IUniswapV2Factory public immutable factory;
  IUniswapV2Router02 public immutable router;
  IWETH public immutable WETH;

  /* Events */
  event LiquidityAdded(
    address indexed account,
    address lpToken,
    uint256 amount
  );
  event LiquidityRemoved(
    address indexed account,
    address lpToken,
    uint256 amount
  );
  event SwappedExactInput();
  event SwappedExactOutput();
  event Withdrawn(address token, uint256 balance);

  constructor(address _factory, address _router) {
    factory = IUniswapV2Factory(_factory);
    router = IUniswapV2Router02(_router);
    WETH = IWETH(router.WETH());

    tokensLen = 0;
  }

  function getLpTokens() public view returns (address[] memory _lpTokens) {
    _lpTokens = lpTokens[msg.sender];
  }

  function getLpTokenName(address lpToken)
    public
    view
    returns (string memory _lpTokenName)
  {
    _lpTokenName = lpTokenNames[lpToken];
  }

  function sortTokens(address tokenA, address tokenB)
    internal
    pure
    returns (address token0, address token1)
  {
    require(tokenA != tokenB, "UniswapV2Library: IDENTICAL_ADDRESSES");
    (token0, token1) = tokenA < tokenB ? (tokenA, tokenB) : (tokenB, tokenA);
    require(token0 != address(0), "UniswapV2Library: ZERO_ADDRESS");
  }

  function findLpToken(address account, address lpToken)
    internal
    view
    returns (uint256 index)
  {
    index = 0;

    for (index = 0; index < lpTokens[account].length; index++) {
      if (lpTokens[account][index] == lpToken) break;
    }

    return index;
  }

  function addLpToken(address account, address lpToken) internal {
    uint256 index = findLpToken(account, lpToken);

    if (lpTokens[account].length == 0 || index != lpTokens[account].length)
      lpTokens[account].push(lpToken);
  }

  function removeLpToken(address account, address lpToken) internal {
    uint256 index = findLpToken(account, lpToken);
    if (index == lpTokens[account].length) return;

    if (lpTokens[account].length > 1) {
      while (index < lpTokens[account].length - 1) {
        lpTokens[account][index] = lpTokens[account][index + 1];
        index++;
      }
    }

    lpTokens[account].pop();
  }

  function markToken(address token) private {
    if (exist[token] == true) return;

    tokens[tokensLen] = token;
    tokensLen = tokensLen + 1;
    exist[token] = true;
  }

  function subFee(uint256 amount) private pure returns (uint256) {
    return amount - amount / 1000;
  }

  function addFee(uint256 amount) private pure returns (uint256) {
    return (1000 * amount) / 999;
  }

  function addLiquidity(
    address token0,
    address token1,
    uint256 amount0,
    uint256 amount1,
    uint256 amountMin0,
    uint256 amountMin1
  )
    public
    returns (
      uint256 amountAdded0,
      uint256 amountAdded1,
      uint256 liquidity
    )
  {
    require(
      IERC20(token0).transferFrom(msg.sender, address(this), amount0),
      "transfer failed"
    );
    require(
      IERC20(token1).transferFrom(msg.sender, address(this), amount1),
      "transfer failed"
    );

    require(IERC20(token0).approve(address(router), amount0), "approve failed");
    require(IERC20(token1).approve(address(router), amount1), "approve failed");

    (amountAdded0, amountAdded1, liquidity) = router.addLiquidity(
      token0,
      token1,
      amount0,
      amount1,
      amountMin0,
      amountMin1,
      msg.sender,
      block.timestamp
    );

    (address tokenA, address tokenB) = sortTokens(token0, token1);
    address lpToken = factory.getPair(tokenA, tokenB);
    lpTokenNames[lpToken] = string(
      abi.encodePacked("LP", IERC20(tokenA).symbol(), IERC20(tokenB).symbol())
    );
    addLpToken(msg.sender, lpToken);
    emit LiquidityAdded(msg.sender, lpToken, liquidity);
  }

  function computeLiquidityShareValue(
    IUniswapV2Pair lpToken,
    uint256 lpTokenAmount
  ) external view returns (uint256 amount0, uint256 amount1) {
    require(
      lpTokenAmount <= lpToken.balanceOf(msg.sender),
      "Not enough balance..."
    );

    uint256 totalSupply = lpToken.totalSupply();
    (uint256 reserves0, uint256 reserves1, ) = lpToken.getReserves();

    amount0 = (lpTokenAmount * reserves0) / totalSupply;
    amount1 = (lpTokenAmount * reserves1) / totalSupply;
  }

  function removeLiquidity(
    IUniswapV2Pair lpToken,
    uint256 lpTokenAmount,
    address token0,
    address token1,
    uint256 amount0min,
    uint256 amount1min
  ) public returns (uint256 amountRemoved0, uint256 amountRemoved1) {
    require(
      IUniswapV2Pair(lpToken).transferFrom(
        msg.sender,
        address(this),
        lpTokenAmount
      ),
      "transfer failed"
    );

    require(
      IUniswapV2Pair(lpToken).approve(address(router), lpTokenAmount),
      "approve failed"
    );

    (amountRemoved0, amountRemoved1) = router.removeLiquidity(
      token0,
      token1,
      lpTokenAmount,
      amount0min,
      amount1min,
      msg.sender,
      block.timestamp
    );

    uint256 balance = IUniswapV2Pair(lpToken).balanceOf(msg.sender);
    if (balance == 0) removeLpToken(msg.sender, address(lpToken));
    emit LiquidityRemoved(msg.sender, address(lpToken), lpTokenAmount);
  }

  function swapExactTokensIn(
    address tokenIn,
    address tokenOut,
    uint256 amountIn,
    uint256 amountOutMin
  ) public {
    require(
      IERC20(tokenIn).transferFrom(msg.sender, address(this), amountIn),
      "transfer failed"
    );

    uint256 newAmountIn = subFee(amountIn);

    require(
      IERC20(tokenIn).approve(address(router), newAmountIn),
      "approve failed"
    );

    address[] memory path = new address[](2);
    path[0] = tokenIn;
    path[1] = tokenOut;
    router.swapExactTokensForTokens(
      newAmountIn,
      amountOutMin,
      path,
      msg.sender,
      block.timestamp
    );

    markToken(tokenIn);

    emit SwappedExactInput();
  }

  function swapExactTokensOut(
    address tokenIn,
    address tokenOut,
    uint256 amountInMax,
    uint256 amountOut
  ) public {
    require(
      IERC20(tokenIn).transferFrom(msg.sender, address(this), amountInMax),
      "transfer failed"
    );

    uint256 newAmountInMax = subFee(amountInMax);
    require(
      IERC20(tokenIn).approve(address(router), newAmountInMax),
      "approve failed"
    );

    address[] memory path = new address[](2);
    path[0] = tokenIn;
    path[1] = tokenOut;

    router.swapTokensForExactTokens(
      amountOut,
      newAmountInMax,
      path,
      msg.sender,
      block.timestamp
    );

    markToken(tokenIn);

    emit SwappedExactOutput();
  }

  function withdraw() public onlyOwner {
    for (uint256 i = 0; i < tokensLen; i++) {
      uint256 balance = IERC20(tokens[i]).balanceOf(address(this));
      IERC20(tokens[i]).transfer(owner(), balance);

      emit Withdrawn(tokens[i], balance);

      delete exist[tokens[i]];
      delete tokens[i];
    }

    tokensLen = 0;
  }

  function getAmountsOut(uint256 amountIn, address[] memory path)
    public
    view
    returns (uint256[] memory amounts)
  {
    uint256[] memory _amounts = router.getAmountsOut(subFee(amountIn), path);
    _amounts[0] = amountIn;

    return _amounts;
  }

  function getAmountsIn(uint256 amountOut, address[] memory path)
    public
    view
    returns (uint256[] memory amounts)
  {
    uint256[] memory _amounts = router.getAmountsIn(amountOut, path);
    _amounts[0] = addFee(_amounts[0]);

    return _amounts;
  }
}
