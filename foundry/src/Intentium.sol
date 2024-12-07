// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {IERC721} from "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import {IERC721Receiver} from "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";

contract Intentium is Ownable, IERC721Receiver {
    uint256 private _borrowerCount;
    uint256 private _lenderCount;
    uint256 private _solutionCount;
    uint256 private _loanDuration;

    enum Status {
        Pending,
        Borrowed,
        Lended,
        Done,
        Canceled
    }

    struct Collateral {
        uint256 nftId;
        address nftAddress;
    }

    struct BorrowerIntent {
        uint256 id;
        address owner;
        address tokenAddress;
        uint256 value;
        uint256 maxInterest;
        Collateral collateral;
        Status status;
    }

    struct LenderIntent {
        uint256 id;
        address owner;
        address tokenAddress;
        uint256 minInterest;
        uint256 value;
        Status status;
    }

    struct Solution {
        uint256 id;
        uint256 borrowerIntentId;
        uint256 lenderIntentId;
        uint256 interest;
        uint256 dueTimestamp;
    }

    BorrowerIntent[] private _borrowerIntents;
    LenderIntent[] private _lenderIntents;
    Solution[] private _solutions;

    constructor(uint256 loanDuration) Ownable(msg.sender) {
        _borrowerCount = 0;
        _lenderCount = 0;
        _solutionCount = 0;
        _loanDuration = loanDuration;
    }

    function getBorrowerIntents() external view returns (BorrowerIntent[] memory borrowerIntents) {
        return _borrowerIntents;
    }

    function getLenderIntents() external view returns (LenderIntent[] memory lenderIntents) {
        return _lenderIntents;
    }

    function getSolutions() external view returns (Solution[] memory solutions) {
        return _solutions;
    }

    function createBorrowerIntent(
        address tokenAddress,
        uint256 value,
        uint256 maxInterest,
        uint256 nftId,
        address nftAddress
    ) external returns (uint256 borrowerIntentId) {
        IERC721 nftContract = IERC721(nftAddress);
        require(nftContract.ownerOf(nftId) == msg.sender, "Not owner of the NFT");
        require(
            nftContract.getApproved(nftId) == address(this) || nftContract.isApprovedForAll(msg.sender, address(this)),
            "NFT not approved by borrower"
        );

        Collateral memory collateral = Collateral({nftId: nftId, nftAddress: nftAddress});

        BorrowerIntent memory newBorrowerIntent = BorrowerIntent({
            id: _borrowerCount,
            owner: msg.sender,
            tokenAddress: tokenAddress,
            value: value,
            maxInterest: maxInterest,
            collateral: collateral,
            status: Status.Pending
        });

        _borrowerIntents.push(newBorrowerIntent);
        _borrowerCount++;
        return newBorrowerIntent.id;
    }

    function createLenderIntent(address tokenAddress, uint256 value, uint256 minInterest)
        external
        returns (uint256 lenderIntentId)
    {
        IERC20 token = IERC20(tokenAddress);
        require(token.allowance(msg.sender, address(this)) >= value, "Not enough tokens approved by lender");

        LenderIntent memory newLenderIntent = LenderIntent({
            id: _lenderCount,
            owner: msg.sender,
            tokenAddress: tokenAddress,
            value: value,
            minInterest: minInterest,
            status: Status.Pending
        });

        _lenderIntents.push(newLenderIntent);
        _lenderCount++;
        return newLenderIntent.id;
    }

    function changeLoadDuration(uint256 loanDuration) external onlyOwner {
        _loanDuration = loanDuration;
    }

    function solve(uint256 borrowerId, uint256 lenderId) external onlyOwner {
        BorrowerIntent memory borrower = _borrowerIntents[borrowerId];
        LenderIntent memory lender = _lenderIntents[lenderId];

        require(borrower.status == Status.Pending, "Invalid borrower status");
        require(lender.status == Status.Pending, "Invalid lender status");

        require(borrower.value == lender.value, "Invalid Solution");
        require(borrower.tokenAddress == lender.tokenAddress, "Invalid Solution");
        require(borrower.maxInterest >= lender.minInterest, "Invalid Solution");

        uint256 value = borrower.value;
        address tokenAddress = borrower.tokenAddress;
        uint256 interest = lender.minInterest;
        uint256 nftId = borrower.collateral.nftId;
        address nftAddress = borrower.collateral.nftAddress;

        IERC20 token = IERC20(tokenAddress);
        IERC721 nftContract = IERC721(nftAddress);

        // Verify lender tokens
        require(token.allowance(lender.owner, address(this)) >= value, "Not enough tokens approved by lender");
        require(token.balanceOf(lender.owner) >= value, "Insufficient Balance for lender");

        // Verify borrower collateral
        require(nftContract.ownerOf(nftId) == borrower.owner, "Not owner of the NFT");
        require(
            nftContract.getApproved(nftId) == address(this) || nftContract.isApprovedForAll(borrower.owner, address(this)),
            "NFT not approved by owner"
        );

        token.transferFrom(lender.owner, borrower.owner, value);
        nftContract.safeTransferFrom(borrower.owner, address(this), nftId);

        lender.status = Status.Lended;
        _lenderIntents[lenderId] = lender;

        borrower.status = Status.Borrowed;
        _borrowerIntents[borrowerId] = borrower;

        uint256 dueTimestamp = block.timestamp + _loanDuration;

        uint256 solutionId = _solutionCount;
        Solution memory solution = Solution({
            id: solutionId,
            borrowerIntentId: borrowerId,
            lenderIntentId: lenderId,
            interest: interest,
            dueTimestamp: dueTimestamp
        });

        _solutionCount++;
        _solutions.push(solution);
    }

    function repay(uint256 solutionId) external {
        Solution memory solution = _solutions[solutionId];
        require(block.timestamp <= solution.dueTimestamp, "Past the due date");

        BorrowerIntent memory borrowerIntent = _borrowerIntents[solution.borrowerIntentId];
        LenderIntent memory lenderIntent = _lenderIntents[solution.lenderIntentId];

        require(borrowerIntent.status == Status.Borrowed, "Invalid borrower status");
        require(lenderIntent.status == Status.Lended, "Invalid lender status");

        require(borrowerIntent.owner == msg.sender, "Not the borrower");

        IERC20 token = IERC20(borrowerIntent.tokenAddress);
        IERC721 nftContract = IERC721(borrowerIntent.collateral.nftAddress);

        uint256 interestAmount = (borrowerIntent.value * solution.interest) / 100;
        uint256 repaymentAmount = borrowerIntent.value + interestAmount;

        require(
            token.allowance(borrowerIntent.owner, address(this)) >= repaymentAmount,
            "Add allowances of amount to this contract"
        );

        token.transferFrom(borrowerIntent.owner, lenderIntent.owner, repaymentAmount);
        nftContract.safeTransferFrom(address(this), borrowerIntent.owner, borrowerIntent.collateral.nftId);

        lenderIntent.status = Status.Done;
        _lenderIntents[solution.lenderIntentId] = lenderIntent;

        borrowerIntent.status = Status.Done;
        _borrowerIntents[solution.borrowerIntentId] = borrowerIntent;
    }

    function cancelBorrowerIntent(uint256 borrowerIntentId) external {
        BorrowerIntent memory borrowerIntent = _borrowerIntents[borrowerIntentId];

        require(borrowerIntent.owner == msg.sender, "Not the borrwer");
        require(borrowerIntent.status == Status.Pending, "Invalid status");

        IERC721 nftContract = IERC721(borrowerIntent.collateral.nftAddress);

        nftContract.safeTransferFrom(address(this), borrowerIntent.owner, borrowerIntent.collateral.nftId);

        borrowerIntent.status = Status.Canceled;
        _borrowerIntents[borrowerIntentId] = borrowerIntent;
    }

    function cancelLenderIntent(uint256 lenderIntentId) external {
        LenderIntent memory lenderIntent = _lenderIntents[lenderIntentId];

        require(lenderIntent.owner == msg.sender, "Not the lender");
        require(lenderIntent.status == Status.Pending, "Invalid status");

        lenderIntent.status = Status.Canceled;
        _lenderIntents[lenderIntentId] = lenderIntent;
    }

    function claimCollaeral(uint256 solutionId) external {
        Solution memory solution = _solutions[solutionId];
        require(block.timestamp > solution.dueTimestamp, "Not yet due");

        BorrowerIntent memory borrowerIntent = _borrowerIntents[solution.borrowerIntentId];
        LenderIntent memory lenderIntent = _lenderIntents[solution.lenderIntentId];

        require(borrowerIntent.status == Status.Borrowed, "Invalid borrower status");
        require(lenderIntent.status == Status.Lended, "Invalid lender status");

        require(lenderIntent.owner == msg.sender, "Not the borrower");

        IERC721 nftContract = IERC721(borrowerIntent.collateral.nftAddress);

        nftContract.safeTransferFrom(address(this), lenderIntent.owner, borrowerIntent.collateral.nftId);

        lenderIntent.status = Status.Done;
        _lenderIntents[solution.lenderIntentId] = lenderIntent;

        borrowerIntent.status = Status.Done;
        _borrowerIntents[solution.borrowerIntentId] = borrowerIntent;
    }

    function onERC721Received(address, address, uint256, bytes calldata) external pure returns (bytes4) {
        return IERC721Receiver.onERC721Received.selector;
    }
}
