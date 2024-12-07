// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import {Script, console} from "forge-std/Script.sol";
import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract CustomERC20 is ERC20 {
    constructor(string memory name, string memory symbol, uint256 initialSupply) ERC20(name, symbol) {
        _mint(msg.sender, initialSupply * (10 ** decimals()));
    }
    function mint(address to, uint256 amount) external {
        _mint(to, amount * (10 ** decimals()));
    }
}

contract DeployERC20TokensScript is Script {
    function run() external {
        uint256 privateKey = vm.envUint("PRIVATE_KEY");

        vm.startBroadcast(privateKey);

        uint256 initialSupply = 10000;

        new CustomERC20("AlphaToken", "ALPHA", initialSupply);
        new CustomERC20("BetaToken", "BETA", initialSupply);
        new CustomERC20("GammaToken", "GAMMA", initialSupply);
        new CustomERC20("DeltaToken", "DELTA", initialSupply);

        vm.stopBroadcast();
    }
}
