// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract TaskNFT is ERC721, Ownable {

    constructor() ERC721("Non fungible token of task", "NFTT") { }

    function mint(address to, uint256 tokenId) public onlyOwner {
        _mint(to, tokenId);
    }

    function isApprovedOrOwner(address spender, uint256 tokenId) public view onlyOwner returns (bool) {
        return _isApprovedOrOwner(spender, tokenId);
    }

    function burn(uint256 tokenId) public onlyOwner {
        _burn(tokenId);
    }

    function approveTask(address to, uint256 tokenId) public onlyOwner {
        _approve(to, tokenId);
    }

}

