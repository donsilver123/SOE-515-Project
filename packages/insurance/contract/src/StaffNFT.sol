// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.8.0;

import {ERC721} from "solady/tokens/ERC721.sol";
import {LibString} from "solady/utils/LibString.sol";

contract StaffNFT is ERC721 {
    string public baseServerUrl;

    constructor(string memory _baseServerUrl) {
        baseServerUrl = _baseServerUrl;
    }

    function name() public view virtual override returns (string memory) {
        return "StaffNFT";
    }

    function symbol() public view virtual override returns (string memory) {
        return "StaffNFT";
    }

    function tokenURI(
        uint256 id
    ) public view virtual override returns (string memory) {
        return string.concat(baseServerUrl, LibString.toString(id));
    }
}
