// SPDX-License-Identifier: MIT
pragma solidity 0.8.9;

import "@openzeppelin/contracts/access/Ownable.sol";

import "@uniswap/v2-periphery/contracts/interfaces/IWETH.sol";
import "@uniswap/v2-periphery/contracts/interfaces/IERC20.sol";
import "@uniswap/v2-periphery/contracts/interfaces/IUniswapV2Router02.sol";
import "@uniswap/v2-core/contracts/interfaces/IUniswapV2Factory.sol";
import "@uniswap/v2-core/contracts/interfaces/IUniswapV2Pair.sol";

/// @title DEX based on UniswapV2 API
/// @author Filip Manole
/// @notice add/remove liquidity from pools, swap ERC20 tokens
contract Swapper is Ownable {
  /* State variables */

  IUniswapV2Factory private immutable factory;
  IUniswapV2Router02 private immutable router;
  IWETH private immutable WETH;

  mapping(address => address[]) public lpTokens;
  mapping(address => string) public lpTokenNames;

  uint256 private tokensLen;
  mapping(uint256 => address) private tokens;
  mapping(address => bool) private exist;

  /* Events */

  /// @notice event emited when liquidity is added into pool
  /// @dev event emited when a pool is created or liquidity is provided
  /// @param account account address which performed the liquidity add action
  /// @param lpToken liquidity token address that was added
  /// @param amount amount of added liquidity
  event LiquidityAdded(
    address indexed account,
    address lpToken,
    uint256 amount
  );

  /// @notice event emited when liquidity is removed from pool
  /// @param account account address which performed the liquidity remove action
  /// @param lpToken liquidity token address that was removed
  /// @param amount amount of removed liquidity
  event LiquidityRemoved(
    address indexed account,
    address lpToken,
    uint256 amount
  );

  /// @notice event emited when tokens are swapped
  /// @dev same event for swapping a fixed input amount or swapping for a fixed output amount
  /// @param account account address which performed the swap
  /// @param tokenIn address of the input token
  /// @param balanceIn balance of the input token
  /// @param tokenOut address of the output token
  /// @param balanceOut balance of the output token
  event Swapped(
    address indexed account,
    address tokenIn,
    uint256 balanceIn,
    address tokenOut,
    uint256 balanceOut
  );

  /// @notice event emited when tokens are transfered into the owner account
  /// @param token address of the withdrawn token
  /// @param balance balance of the withdrawn token
  event Withdrawn(address token, uint256 balance);

  /* Constructor */

  /// @notice constructor for the Swapper contract
  /// @param _factory address of the Uniswap Factory contract
  /// @param _router address of the Router02 Factory contract
  constructor(address _factory, address _router) {
    factory = IUniswapV2Factory(_factory);
    router = IUniswapV2Router02(_router);
    WETH = IWETH(router.WETH());

    tokensLen = 0;
  }

  /* Getters */

  /// @notice getter for the liquidity tokens of the sender
  /// @return _lpTokens liquidity tokens holded by the sender
  function getLpTokens() public view returns (address[] memory _lpTokens) {
    _lpTokens = lpTokens[msg.sender];
  }

  /// @notice getter for the symbol of a liquidity token
  /// @param lpToken address of the liquidity token
  /// @return _lpTokenName symbol of the given liquidity token
  function getLpTokenName(address lpToken)
    public
    view
    returns (string memory _lpTokenName)
  {
    _lpTokenName = lpTokenNames[lpToken];
  }

  /* Internal functions: helpers */

  /// @notice sorts two addresses
  /// @dev this method is also provided in the Uniswap Library contract,
  ///      but the conctract could not be included, since it uses an older compiler version
  /// @param tokenA address of the first token
  /// @param tokenB address of the second token
  /// @return token0 first address of (tokenA, tokenB) in alphabetical order
  /// @return token1 second address of (tokenA, tokenB) in alphabetical order
  function sortTokens(address tokenA, address tokenB)
    private
    pure
    returns (address token0, address token1)
  {
    require(tokenA != tokenB, "IDENTICAL_ADDRESSES");
    (token0, token1) = tokenA < tokenB ? (tokenA, tokenB) : (tokenB, tokenA);
    require(token0 != address(0), "ZERO_ADDRESS");
  }

  /// @notice searches for the address of a liquidity token in the account's balance
  /// @dev the address of the holded liquidity tokens are stored into an array for each account.
  /// @param account address of the holder
  /// @param lpToken address of the liquidity token
  /// @return index if token exists, index of the token address,
  ///         otherwise the length of the array
  function findLpToken(address account, address lpToken)
    private
    view
    returns (uint256 index)
  {
    index = 0;

    for (index = 0; index < lpTokens[account].length; index++) {
      if (lpTokens[account][index] == lpToken) break;
    }

    return index;
  }

  /// @notice adds a liquidity token from the account's balance
  /// @dev the address of the holded liquidity tokens are stored into an array for each account.
  /// @param account address of the holder
  /// @param lpToken address of the liquidity token
  function addLpToken(address account, address lpToken) private {
    uint256 index = findLpToken(account, lpToken);

    if (lpTokens[account].length == 0 || index != lpTokens[account].length)
      lpTokens[account].push(lpToken);
  }

  /// @notice removes a liquidity token from the account's balance
  /// @dev the address of the holded liquidity tokens are stored into an array for each account.
  /// @param account address of the holder
  /// @param lpToken address of the liquidity token
  function removeLpToken(address account, address lpToken) private {
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

  /// @notice saves the address of the token holded by the contract as fee
  /// @param token address of the token that will be marked
  function markToken(address token) private {
    if (exist[token] == true) return;

    tokens[tokensLen] = token;
    tokensLen = tokensLen + 1;
    exist[token] = true;
  }

  /// @notice substracts the 0.01% fee from a received amount
  /// @param amount integer from which the fee will be substracted
  /// @return amountSubFee amount remaining after substracting the fee
  function subFee(uint256 amount) private pure returns (uint256 amountSubFee) {
    amountSubFee = amount - amount / 1000;
  }

  /// @notice adds the 0.01% fee to the a received amount
  /// @param amount integer to which the fee will be added
  /// @return amountPlusFee amount resulted after adding the fee
  function addFee(uint256 amount) private pure returns (uint256 amountPlusFee) {
    amountPlusFee = (1000 * amount) / 999;
  }

  /* Core functionality for providing liquidity */

  /// @notice computes the amounts of the two tokens inside a liquidity pair
  /// @param lpToken address of a UniswapV2Pair
  /// @param lpTokenAmount amount of the liquidity token
  /// @return amount0 amount of the first token in the liquidity token
  /// @return amount1 amount of the second token in the liquidity token
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

  /// @notice adds liquidity in an existing pool; if the pool does not exist, it will be created;
  /// @dev emmits LiquidityAdded
  /// @param token0 a pool token
  /// @param token1 a pool token
  /// @param amount0 the amount of token0 to add as liquidity
  /// @param amount1 the amount of token1 to add as liquidity
  /// @param amountMin0 must be <= amount0
  /// @param amountMin1 must be <= amount1
  /// @return amountAdded0 the amount of token0 sent to the pool
  /// @return amountAdded1 the amount of token1 sent to the pool
  /// @return liquidity the amount of liquidity tokens minted
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

  /// @notice removes liquidity from a pool
  /// @dev emits LiquidityRemoved
  /// @param lpToken a liquidity token
  /// @param lpTokenAmount amount of a liquidity token
  /// @param token0 A token from the pair of lpToken liquidity token
  /// @param token1 A token from the pair of lpToken liquidity token
  /// @param amountMin0 The minimum amount of token0 that must be received for the transaction not to revert
  /// @param amountMin1 The minimum amount of token1 that must be received for the transaction not to revert.
  /// @return amount0 The amount of token0 received.
  /// @return amount1 The amount of token1 received.
  function removeLiquidity(
    IUniswapV2Pair lpToken,
    uint256 lpTokenAmount,
    address token0,
    address token1,
    uint256 amountMin0,
    uint256 amountMin1
  ) public returns (uint256 amount0, uint256 amount1) {
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

    uint256 balance = IUniswapV2Pair(lpToken).balanceOf(msg.sender);
    if (balance == 0) removeLpToken(msg.sender, address(lpToken));
    emit LiquidityRemoved(msg.sender, address(lpToken), lpTokenAmount);

    (amount0, amount1) = router.removeLiquidity(
      token0,
      token1,
      lpTokenAmount,
      amountMin0,
      amountMin1,
      msg.sender,
      block.timestamp
    );
  }

  /* Core functionality for token swapping */

  /// @notice get amount of tokens obtained for a fixed amount of tokens
  /// @param amountIn amount of the provided tokens
  /// @param path path[0] address of the provided token
  ///             path[1] address of the resulted token
  /// @return amounts amounts[0] amount of the provided token
  ///                 amounts[1] amount of the resulted token
  function getAmountsOut(uint256 amountIn, address[] memory path)
    public
    view
    returns (uint256[] memory amounts)
  {
    uint256[] memory _amounts = router.getAmountsOut(subFee(amountIn), path);
    _amounts[0] = amountIn;

    return _amounts;
  }

  /// @notice get amount of tokens required to obtain a fixed amount of tokens
  /// @param amountOut amount of the desired tokens
  /// @param path path[0] address of the provided token
  ///             path[1] address of the desired token
  /// @return amounts amounts[0] amount of the provided token
  ///                 amounts[1] amount of the desired token
  function getAmountsIn(uint256 amountOut, address[] memory path)
    public
    view
    returns (uint256[] memory amounts)
  {
    uint256[] memory _amounts = router.getAmountsIn(amountOut, path);
    _amounts[0] = addFee(_amounts[0]);

    return _amounts;
  }

  /// @notice swapps an exact amount of input tokens for a minimum amount of output tokens
  /// @dev emits Swapped event
  /// @param address tokenIn the address of the input token
  /// @param address tokenOut the address of the output token
  /// @param uint256 amountIn the amount of input tokens to send
  /// @param uint256 amountOutMin the minimum amount of output tokens that must be received for the transaction not to revert
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

    markToken(tokenIn);

    address[] memory path = new address[](2);
    path[0] = tokenIn;
    path[1] = tokenOut;

    uint256[] memory _amounts = router.swapExactTokensForTokens(
      newAmountIn,
      amountOutMin,
      path,
      msg.sender,
      block.timestamp
    );

    emit Swapped(msg.sender, tokenIn, _amounts[0], tokenOut, _amounts[1]);
  }

  /// @notice swapps a maximum amount of input tokens for an exact amount of output tokens
  /// @dev emits Swapped event
  /// @param address tokenIn the address of the input token
  /// @param address tokenOut the address of the output token
  /// @param uint256 amountInMax the maximum amount of input tokens that can be required before the transaction reverts
  /// @param uint256 amountOut the amount of output tokens to receive
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

    markToken(tokenIn);

    address[] memory path = new address[](2);
    path[0] = tokenIn;
    path[1] = tokenOut;

    uint256[] memory _amounts = router.swapTokensForExactTokens(
      amountOut,
      newAmountInMax,
      path,
      msg.sender,
      block.timestamp
    );

    emit Swapped(msg.sender, tokenIn, _amounts[0], tokenOut, _amounts[1]);
  }

  /// @notice transfers all accumultaed fees into owner acount
  /// @dev emits Withdrawn event for every ERC20 token transfer
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
}
