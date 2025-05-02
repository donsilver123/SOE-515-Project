// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import {ERC20} from "solady/tokens/ERC20.sol";

contract USDC is ERC20 {
    function mint(address _recipient, uint256 _amount) external {
        _mint(_recipient, _amount);
    }

    function mint(uint256 _amount) external {
        _mint(msg.sender, _amount);
    }

    function name() public view virtual override returns (string memory) {
        return "USDC";
    }

    function symbol() public view virtual override returns (string memory) {
        return "USDC";
    }

    function decimals() public view virtual override returns (uint8) {
        return 2;
    }
}
