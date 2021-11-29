// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

/// @title ERC20 tokens minter
/// @author Filip Manole
/// @notice mint only 1000 DummyToken per account
contract DummyToken is ERC20 {
  mapping(address => bool) minted;

  constructor(string memory name, string memory symbol) ERC20(name, symbol) {}

  /// @notice if tokens were minted returns true, otherwise false
  function getStatus() public view returns (bool status) {
    status = minted[msg.sender];
  }

  ///@notice this function should mint 1000 tokens into the msg.sender balance
  function mint() public {
    require(minted[msg.sender] == false, "User already minted these tokens");
    minted[msg.sender] = true;
    _mint(msg.sender, 1000 * 10**decimals());
  }
}
