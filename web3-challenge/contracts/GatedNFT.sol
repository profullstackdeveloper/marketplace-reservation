// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract GatedNFT is ERC721, Ownable {
    uint256 public constant STAKE_DURATION = 7 days;

    struct StakeInfo {
        uint256 stakedAt;
    }

    mapping(uint256 => StakeInfo) public stakingInfo;
    mapping(uint256 => address[]) public delegatedAddresses;
    mapping(bytes32 => address) public emailToAddress;
    mapping(address => bytes32) public addressToEmail;

    event Staked(
        address indexed user,
        uint256 indexed tokenId,
        uint256 timestamp
    );
    event Unstaked(
        address indexed user,
        uint256 indexed tokenId,
        uint256 timestamp
    );
    event Delegated(
        address indexed owner,
        uint256 indexed tokenId,
        address indexed delegatee
    );
    event EmailRegistered(address indexed user, string email);

    constructor(
        string memory name_,
        string memory symbol_,
        address initialOwner
    )
        ERC721(name_, symbol_)
        Ownable(initialOwner)
    {}

    function registerEmail(string calldata email) external {
        bytes32 emailHash = keccak256(abi.encodePacked(email));
        require(
            emailToAddress[emailHash] == address(0),
            "Email already registered"
        );
        require(
            addressToEmail[msg.sender] == bytes32(0),
            "Address already registered with an email"
        );

        emailToAddress[emailHash] = msg.sender;
        addressToEmail[msg.sender] = emailHash;

        emit EmailRegistered(msg.sender, email);
    }

    function stake(uint256 tokenId) external onlyOwnerOrDelegate(tokenId) {
        StakeInfo storage info = stakingInfo[tokenId];
        require(info.stakedAt == 0, "NFT already staked");

        info.stakedAt = block.timestamp;

        emit Staked(msg.sender, tokenId, block.timestamp);
    }

    function unstake(uint256 tokenId) external onlyOwnerOrDelegate(tokenId) {
        StakeInfo storage info = stakingInfo[tokenId];
        require(info.stakedAt != 0, "NFT is not staked");

        info.stakedAt = 0;

        emit Unstaked(msg.sender, tokenId, block.timestamp);
    }

    function delegate(uint256 tokenId, address delegatee) external {
        require(ownerOf(tokenId) == msg.sender, "Only owner can delegate");
        require(delegatee != address(0), "Cannot delegate to zero address");

        delegatedAddresses[tokenId].push(delegatee);

        emit Delegated(msg.sender, tokenId, delegatee);
    }

    function isStakingDurationMet(uint256 tokenId) public view returns (bool) {
        StakeInfo memory info = stakingInfo[tokenId];
        if (info.stakedAt == 0) return false;
        return block.timestamp >= info.stakedAt + STAKE_DURATION;
    }

    modifier onlyOwnerOrDelegate(uint256 tokenId) {
        require(
            ownerOf(tokenId) == msg.sender || isDelegated(tokenId, msg.sender),
            "Not owner or delegated"
        );
        _;
    }

    function isDelegated(
        uint256 tokenId,
        address addr
    ) public view returns (bool) {
        address[] memory delegates = delegatedAddresses[tokenId];
        for (uint256 i = 0; i < delegates.length; i++) {
            if (delegates[i] == addr) {
                return true;
            }
        }
        return false;
    }

    function _beforeTokenTransfer(
        address from,
        uint256 tokenId
    ) internal virtual {
        if (from != address(0)) {
            stakingInfo[tokenId].stakedAt = 0;
        }
    }

    function mint(address to, uint256 tokenId) external onlyOwner {
        _safeMint(to, tokenId);
    }
}
