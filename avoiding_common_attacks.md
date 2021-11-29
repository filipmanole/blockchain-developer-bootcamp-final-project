# Avoiding Common Attacks

## [SWC-103 Floating Pragma](https://swcregistry.io/docs/SWC-103)

The solidity contract is not intended to be inherited by other contracts, and a suite of tests is developed and ran against the contract developed under 0.8.9 compiler. There are no reasons in using floating pragma.

```sol
pragma solidity 0.8.9;
```

## [SWC-115 Authorization through tx.origin](https://swcregistry.io/docs/SWC-115)

tx.origin is not used in any authorizations.
In the contract, only the owner should be allowed to withdraw accumulated fees in the contracts. To authorize this transaction, it is used the modifier `onlyOwner` from the inherited contract Owner. The contract Owner is provided by Open Zeppelin, considered safe to use because it is audited. 

```
function withdraw() public onlyOwner {...}
```

## [SWC-107 Re-entrancy attack](https://swcregistry.io/docs/SWC-107)

Functions were developed using **`Checks-Effects-Interactions`** pattern. To understand how the pattern was applied, follow the comments added in the next method from the developed contract.

```typescript
  function swapExactTokensIn(
    address tokenIn,
    address tokenOut,
    uint256 amountIn,
    uint256 amountOutMin
  ) public {

    /* The begginging of the function starts with the check parts, where the
    response of two external calls are validated using require() guard function */
    require(
      IERC20(tokenIn).transferFrom(msg.sender, address(this), amountIn),
      "transfer failed"
    );

    uint256 newAmountIn = subFee(amountIn);

    require(
      IERC20(tokenIn).approve(address(router), newAmountIn),
      "approve failed"
    );

    /* After validations are performed, the state of the contract is modified
    by calling markToken() */
    markToken(tokenIn);

    address[] memory path = new address[](2);
    path[0] = tokenIn;
    path[1] = tokenOut;

    /* In the final stage, an external contract method call is performed */
    uint256[] memory _amounts = router.swapExactTokensForTokens(
      newAmountIn,
      amountOutMin,
      path,
      msg.sender,
      block.timestamp
    );

    emit Swapped(msg.sender, tokenIn, _amounts[0], tokenOut, _amounts[1]);
  }
```

## [SWC-110 Assert Violation](https://swcregistry.io/docs/SWC-110)

This relates to a proper usage of the guard functions: `assert()`, `require()` and `revert()`.

In the developed contract, the `assert()` function was avoided, since it consumes all the remaining gas, and there was no complicated logic suitable to use the `revert()` function.

`require()` function was used more often:

- to validate inputs before using them in a method:

  ```sol
  function sortTokens(address tokenA, address tokenB)
    private
    pure
    returns (address token0, address token1)
  {
    require(tokenA != tokenB, "IDENTICAL_ADDRESSES");
    ...
  }
  ```

- to validate the response from an external contract:

  ```sol
  require(
    IERC20(token0).transferFrom(msg.sender, address(this), amount0),
    "transfer failed"
  );
  ```
