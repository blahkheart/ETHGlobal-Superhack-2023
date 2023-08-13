// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Token is ERC20, Ownable {
	constructor(string memory name, string memory symbol) ERC20(name, symbol) {}

	function faucet(uint amount) public {
		_mint(_msgSender(), amount);
	}

	function faucet(address to, uint amount) public {
		_mint(to, amount);
	}

	function mint(address to, uint256 amount) public onlyOwner {
		_mint(to, amount);
	}
}
