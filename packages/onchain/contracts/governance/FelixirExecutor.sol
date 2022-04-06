// SPDX-License-Identifier: BSD-3-Clause

pragma solidity 0.8.13;

contract FelixirExecutor {
    // event NewAdmin(address indexed newAdmin);
    // event NewPendingAdmin(address indexed newPendingAdmin);
    // event NewDelay(uint256 indexed newDelay);

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
    // uint256 public constant MINIMUM_DELAY = 2 days;
    // uint256 public constant MAXIMUM_DELAY = 30 days;
    uint256 public constant DELAY = 7 days;

    address public admin;
    // address public pendingAdmin;
    // uint256 public delay;

    mapping(bytes32 => bool) public queuedTransactions;

    modifier onlyAdmin() {
        require(msg.sender == admin, 'FelixirExecutor::queueTransaction: Call must come from admin.');
        _;
    }

    constructor(address admin_) {
        // require(delay_ >= MINIMUM_DELAY, 'FelixirExecutor::constructor: Delay must exceed minimum delay.');
        // require(delay_ <= MAXIMUM_DELAY, 'FelixirExecutor::setDelay: Delay must not exceed maximum delay.');

        admin = admin_;
        // delay = delay_;
    }

    // function setDelay(uint256 delay_) public {
    //     require(msg.sender == address(this), 'FelixirExecutor::setDelay: Call must come from FelixirExecutor.');
    //     require(delay_ >= MINIMUM_DELAY, 'FelixirExecutor::setDelay: Delay must exceed minimum delay.');
    //     require(delay_ <= MAXIMUM_DELAY, 'FelixirExecutor::setDelay: Delay must not exceed maximum delay.');
    //     delay = delay_;

    //     emit NewDelay(delay);
    // }

    // function acceptAdmin() public {
    //     require(msg.sender == pendingAdmin, 'FelixirExecutor::acceptAdmin: Call must come from pendingAdmin.');
    //     admin = msg.sender;
    //     pendingAdmin = address(0);

    //     emit NewAdmin(admin);
    // }

    // function setPendingAdmin(address pendingAdmin_) public {
    //     require(
    //         msg.sender == address(this),
    //         'FelixirExecutor::setPendingAdmin: Call must come from FelixirExecutor.'
    //     );
    //     pendingAdmin = pendingAdmin_;

    //     emit NewPendingAdmin(pendingAdmin);
    // }

    function queueTransaction(
        address target,
        uint256 value,
        string memory signature,
        bytes memory data,
        uint256 eta
    ) public onlyAdmin returns (bytes32) {
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
    ) public onlyAdmin {
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
    ) public onlyAdmin returns (bytes memory) {
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
