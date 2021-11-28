# Design Pattern Decisions

## Inheritances and Interfaces

The developed contract (`Swapper.sol`) provided by OpenZeppelin.

- **`@openzeppelin/contracts/access/Ownable.sol"`**

    The Swapper contract inherits from Ownable contract, to restrict the permission of the *`withdraw`*.

- **`@uniswap/v2-periphery/contracts/interfaces/IERC20.sol"`**

    *`IERC20`* is the interface used to interact with ERC20 tokens.

- **`@uniswap/v2-periphery/contracts/interfaces/IUniswapV2Router02.sol"`**

    *`IUniswapV2Router02`* is the interface of the contract used to provide/remove liquidity, swap tokens, and calculate expected outputs.

- **`@uniswap/v2-core/contracts/interfaces/IUniswapV2Pair.sol"`**

    *`IUniswapV2Pair`* is the interface used to interact with the liquidity tokens.

- **`@uniswap/v2-periphery/contracts/interfaces/IWETH.sol"`**

    *`IWETH`* is required by the *`UniswapV2Router02`* constructor.

- **`@uniswap/v2-core/contracts/interfaces/IUniswapV2Factory.sol"`**

    *`IUniswapV2Factory`* is required by the *`UniswapV2Router02`* constructor.

## Inter-Contract Execution

In the developed contract there are a series of external contract calls. The most important of them are the ones that interacts with the *`UniswapV2Router02`*.

- **`addLiquidity`**: used to provide liquidity into pools
- **`removeLiquidity`**: used to remove liquidity from pools
- **`swapExactTokensForTokens`**: used to swap an exact amount of ERC20 tokens into some another ERC20 tokens
- **`swapTokensForExactTokens`**: used to swap some ERC20 tokens into an exact amount of another ERC20 tokens

## Access Control Design

The contract uses the Ownable design pattern to restrict the access to the `withdraw` function. When swaps are performed, 0.01% of any input token is stored in the contract balance. Only the owner can call this function to transfer all the accumulated fees into his account.
