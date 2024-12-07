// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import {Script, console} from "forge-std/Script.sol";
import {ERC721, ERC721URIStorage} from "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

contract CustomNFT is ERC721URIStorage {
    uint256 public tokenCounter;

    constructor(string memory name, string memory symbol) ERC721(name, symbol) {
        tokenCounter = 0;
    }

    function safeMint(address recipient, string memory tokenURI) public returns (uint256) {
        uint256 newItemId = tokenCounter;
        _safeMint(recipient, newItemId);
        _setTokenURI(newItemId, tokenURI);
        tokenCounter += 1;
        return newItemId;
    }
}

contract DeployERC721NFTsScript is Script {
    function run() external {
        uint256 privateKey = vm.envUint("PRIVATE_KEY");
        address account = vm.addr(privateKey);

        vm.startBroadcast(privateKey);

        CustomNFT omegaNFT = new CustomNFT("OmegaNFT", "OMEGA");
        CustomNFT zetaNFT = new CustomNFT("ZetaNFT", "ZETA");

        omegaNFT.safeMint(account, "https://i.imgur.com/90D5G01.jpg");
        zetaNFT.safeMint(account, "https://i.redd.it/lopvbyiltsoa1.png");

        vm.stopBroadcast();
    }
}
