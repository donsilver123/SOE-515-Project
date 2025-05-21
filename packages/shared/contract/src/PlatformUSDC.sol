// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import {ERC20} from "solady/tokens/ERC20.sol";

contract PlatformUSDC is ERC20 {
    function mint(address _recipient, uint256 _amount) external {
        _mint(_recipient, _amount);
    }

    function mint(uint256 _amount) external {
        _mint(msg.sender, _amount);
    }

    function name() public pure override returns (string memory) {
        return "PlatformUSDC";
    }

    function symbol() public pure override returns (string memory) {
        return "PUSDC";
    }

    function decimals() public pure override returns (uint8) {
        return 2;
    }
}
