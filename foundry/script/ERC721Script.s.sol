// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import {Script, console} from "forge-std/Script.sol";
import {CustomNFT} from "./DeployERC721NFTsScript.s.sol";

contract ERC721Script is Script {
    function run() external {
        uint256 privateKey = vm.envUint("PRIVATE_KEY");
        address account = vm.addr(privateKey);

        address omegaAddress = 0xFfA18ca502Ce2768b082bB5a41157Bd9b7F24ba2;

        CustomNFT token = CustomNFT(omegaAddress);

        vm.startBroadcast(privateKey);

        token.safeMint(account, "https://i.imgur.com/90D5G01.jpg");
        token.safeMint(account, "https://i.imgur.com/90D5G01.jpg");
        token.safeMint(account, "https://i.imgur.com/90D5G01.jpg");
        token.safeMint(account, "https://i.imgur.com/90D5G01.jpg");
        token.safeMint(account, "https://i.imgur.com/90D5G01.jpg");
        token.safeMint(account, "https://i.imgur.com/90D5G01.jpg");
        token.safeMint(account, "https://i.imgur.com/90D5G01.jpg");
        token.safeMint(account, "https://i.imgur.com/90D5G01.jpg");
        token.safeMint(account, "https://i.imgur.com/90D5G01.jpg");
        token.safeMint(account, "https://i.imgur.com/90D5G01.jpg");
        token.safeMint(account, "https://i.imgur.com/90D5G01.jpg");

        vm.stopBroadcast();
    }
}

