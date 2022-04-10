// SPDX-License-Identifier: BSD-3-Clause

/*************************************************************************************
 * ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ *
 * ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░███████████████░░░░░░░░░░░░░░░ *
 * ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░██████░░░░░░░░░░░░░░░██████░░░░░░░░░ *
 * ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░███░░░░░░░░░░░░░░░░░░░░░░░░░░░███░░░░░░ *
 * ░░░░░░██████░░░░░░███░░░░░░░░░███░░░░░░███░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░███░░░ *
 * ░░░███░░░░░░███░░░██████░░░██████░░░░░░███░░░░░░░░░███░░░░░░░░░░░░░░░░░░░░░███░░░ *
 * ░░░███░░░░░░░░░░░░███░░░███░░░███░░░░░░███░░░░░░███░░░███░░░░░░░░░░░░███░░░███░░░ *
 * ░░░███░░░██████░░░███░░░███░░░███░░░░░░███░░░███░░░░░░░░░███░░░░░░░░░░░░██████░░░ *
 * ░░░███░░░░░░███░░░███░░░░░░░░░███░░░░░░░░░██████░░░██████░░░███░░░███░░░░░░███░░░ *
 * ░░░░░░██████░░░░░░███░░░░░░░░░███░░░░░░░░░░░░███░░░   ░░░░░░░░░███░░░███░░░███░░░ *
 * ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░███░░░   ░░░░░░░░░░░░░░░██████░░░░░░ *
 * ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░███░░░░░░░░░░░░░░░░░░██████░░░░░░░░░ *
 * ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░███░░░░░░░░░██████░░░░░░░░░░░░░░░ *
 * ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░█████████░░░░░░░░░░░░░░░░░░░░░ *
 * ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ *
**************************************************************************************/

// LICENSE
// FelixirExecutor.sol is a modified version of Compound Lab's Timelock and NounsDAO's NounsDAOExecutor.sol:
// https://github.com/compound-finance/compound-protocol/blob/20abad28055a2f91df48a90f8bb6009279a4cb35/contracts/Timelock.sol
// https://github.com/nounsDAO/nouns-monorepo/blob/master/packages/nouns-contracts/contracts/governance/NounsDAOExecutor.sol
//
// Timelock.sol source code Copyright 2020 Compound Labs, Inc. licensed under the BSD-3-Clause license.
// NounsDAOExecutor.sol source code Copyright 2022 NounsDAO, Inc. licensed under the BSD-3-Clause license.
// With modifications by FelixirDAO.
//
// Additional conditions of BSD-3-Clause can be found here: https://opensource.org/licenses/BSD-3-Clause
//
// MODIFICATIONS
// FelixirExecutor.sol modifies NounsDAOExecutor to add admin and login addresses.
// NounsDAOExecutor refferes to Compound's Timelock.sol.
// This contract acts as executor of FelixirDAO governance and its treasury.

pragma solidity 0.8.13;

contract FelixirExecutor {
    event CancelTransaction(
        bytes32 indexed txHash,
        address indexed target,
        uint256 value,
        string signature,
        bytes data,
        uint256 eta
    );
    event ExecuteTransaction(
        bytes32 indexed txHash,
        address indexed target,
        uint256 value,
        string signature,
        bytes data,
        uint256 eta
    );
    event QueueTransaction(
        bytes32 indexed txHash,
        address indexed target,
        uint256 value,
        string signature,
        bytes data,
        uint256 eta
    );

    uint256 public constant GRACE_PERIOD = 14 days;
    uint256 public constant DELAY = 7 days;

    address public admin;
    address public logic;

    mapping(bytes32 => bool) public queuedTransactions;

    modifier onlyLogic() {
        require(msg.sender == logic, 'FelixirExecutor::queueTransaction: Call must come from logic contract.');
        _;
    }

    modifier onlyAdmin() {
        require(msg.sender == admin, 'FelixirExecutor::queueTransaction: Call must come from admin.');
        _;
    }

    constructor() {
        admin = msg.sender;
    }

    function setLogic(address _logic) external onlyAdmin {
        logic = _logic;
    }

    function setAdmin(address _admin) external onlyAdmin {
        admin = _admin;
    }

    function queueTransaction(
        address target,
        uint256 value,
        string memory signature,
        bytes memory data,
        uint256 eta
    ) public onlyLogic returns (bytes32) {
        require(
            eta >= getBlockTimestamp() + DELAY,
            'FelixirExecutor::queueTransaction: Estimated execution block must satisfy delay.'
        );

        bytes32 txHash = keccak256(abi.encode(target, value, signature, data, eta));
        queuedTransactions[txHash] = true;

        emit QueueTransaction(txHash, target, value, signature, data, eta);
        return txHash;
    }

    function cancelTransaction(
        address target,
        uint256 value,
        string memory signature,
        bytes memory data,
        uint256 eta
    ) public onlyLogic {
        bytes32 txHash = keccak256(abi.encode(target, value, signature, data, eta));
        queuedTransactions[txHash] = false;

        emit CancelTransaction(txHash, target, value, signature, data, eta);
    }

    function executeTransaction(
        address target,
        uint256 value,
        string memory signature,
        bytes memory data,
        uint256 eta
    ) public onlyLogic returns (bytes memory) {
        bytes32 txHash = keccak256(abi.encode(target, value, signature, data, eta));
        require(queuedTransactions[txHash], "FelixirExecutor::executeTransaction: Transaction hasn't been queued.");

        require(
            getBlockTimestamp() >= eta,
            "FelixirExecutor::executeTransaction: Transaction hasn't surpassed time lock."
        );
        require(
            getBlockTimestamp() <= eta + GRACE_PERIOD,
            'FelixirExecutor::executeTransaction: Transaction is stale.'
        );

        queuedTransactions[txHash] = false;

        bytes memory callData;

        if (bytes(signature).length == 0) {
            callData = data;
        } else {
            callData = abi.encodePacked(bytes4(keccak256(bytes(signature))), data);
        }

        // solium-disable-next-line security/no-call-value
        (bool success, bytes memory returnData) = target.call{ value: value }(callData);
        require(success, 'FelixirExecutor::executeTransaction: Transaction execution reverted.');

        emit ExecuteTransaction(txHash, target, value, signature, data, eta);

        return returnData;
    }

    function getBlockTimestamp() internal virtual view returns (uint256) {
        // solium-disable-next-line security/no-block-members
        return block.timestamp;
    }

    receive() external payable {}

    fallback() external payable {}
}
