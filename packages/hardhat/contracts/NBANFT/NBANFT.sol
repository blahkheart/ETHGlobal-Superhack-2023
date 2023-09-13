// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

/**
    !Disclaimer!
    please review this code on your own before using any of
    the following code for production.
    Dannithomx will not be liable in any way if for the use 
    of the code. That being said, the code has been tested 
    to the best of the developers' knowledge to work as intended.
*/


import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "base64-sol/base64.sol";
import "./lib/ColorGenerator.sol";
import "./NBADescriptor.sol";
import "./interfaces/IERC6551Registry.sol";
/**
 * @title NBA NFT Contract
 * @author Danny Thomx
 * @notice This contract mints and manages the NBA NFTs.
 * @dev Ensure you're familiar with ERC721 standard before interacting with this contract.
 */

contract NBA is ERC721Enumerable, Ownable {
    using Strings for uint256;
    using Strings for uint160;
    using Counters for Counters.Counter;

    /// @dev Maximum number of NFTs available for minting.
    uint256 public maxSupply = 2000;

    /// @dev Cost of minting an NFT.
    uint256 public price = 0.02 ether;

    /// @dev Maximum number of NFTs one can mint in a single transaction.
    uint256 public maxMintAmount = 5;

    /// @dev State variable to control minting functionality.
    bool public paused = false;

    /// @dev Address of the team for revenue sharing.
    address public team = 0xCA7632327567796e51920F6b16373e92c7823854;

    /// @dev Address of the buidlGuidl for revenue sharing.
    address public buidlGuidl = 0x97843608a00e2bbc75ab0C1911387E002565DEDE;

    /// @dev 20% in basis points
    uint256 private constant BUIDLGUIDL_ALLOCATION_BASIS_POINTS = 2000;

    /// @dev Represents 100%
    uint256 private constant BASIS_POINTS = 10000;

    /// @dev Address of the default account implementation.
    address public defaultAccountImplementation;

    /// @dev Counter for tracking tokenIds.
    Counters.Counter private _tokenIdCounter;

    /// @dev Mapping to store colors associated with NFTs.
    mapping(uint256 => bytes3) public color_1;
    mapping(uint256 => bytes3) public color_2;
    mapping(uint256 => bytes3) public color_3;
    mapping(uint256 => bytes3) public color_4;

    /// @dev Mapping to store default accounts for each tokenId.
    mapping(uint256 => address) public tokenIdToDefaultAccountImplementation;

    /// @dev Mapping to store main accounts for each tokenId.
    mapping (uint256 => address) public mainAccount;
    address private immutable tokenDescriptor;
    IERC6551Registry public registry;
    /**
     * @notice Contract constructor to set the name and symbol for the NFT.
     * @param _name Name of the NFT.
     * @param _symbol Symbol of the NFT.
     */
    constructor(
        string memory _name,
        string memory _symbol,
        address _descriptor,
        IERC6551Registry _registry,
        address _defaultImplementation
    ) ERC721(_name, _symbol) {
        tokenDescriptor = _descriptor;
        defaultAccountImplementation =_defaultImplementation;
        registry = _registry;
      }

    /// @notice Allow the contract to receive Ether.
    receive() external payable {}

    /**
     * @notice Owner users to change team's address.
     * @param _newAddress new team address.
     */
    function setTeamAddress(address _newAddress) public onlyOwner {
        team = _newAddress;
    }

    /**
     * @notice Owner users to change buidlGuidl's address.
     * @param _newAddress new buidlGuidl address.
     */
    function setBGAddress(address _newAddress) public onlyOwner {
        buidlGuidl = _newAddress;
    }

    /**
     * @notice Owner users to pause minting of NFTs.
     * @param _isPaused new pause state.
     */
    function pause(bool _isPaused)public onlyOwner {
        paused = _isPaused;
    }

    /**
     * @notice Allows users to mint new NFTs.
     * @param _mintAmount Number of NFTs user wants to mint.
     * @dev The function checks for maximum minting limit and ensures correct payment.
     */
    function mintItem(uint256 _mintAmount) public payable {
        uint256 supply = totalSupply();
        require(!paused, "Minting paused");
        require(supply < maxSupply, "Minting over");
        require(_mintAmount > 0,"Zero amount");
        require(_mintAmount <= maxMintAmount, "Exceeds max mint allowed");

        if (msg.sender != owner()) {
            require(msg.value >= price * _mintAmount, "Insufficient ETH");
        }
        
        for (uint256 i = 1; i <= _mintAmount; i++) {
            _tokenIdCounter.increment();
            uint256 _tokenId = _tokenIdCounter.current();
            _safeMint(msg.sender, _tokenId);
            ColorGenerator.generateColors(_tokenId, color_1, color_2, color_3, color_4);
            address _createdAccount = registry.createAccount(defaultAccountImplementation, block.chainid, address(this), _tokenId, _tokenId, "");
            require(_createdAccount != address(0), "Failed to create account");
            tokenIdToDefaultAccountImplementation[_tokenId] = defaultAccountImplementation;
            setMainAccount(_tokenId,_createdAccount);
        }
    }

    /**
     * @notice Set main account for a specific tokenId.
     * @param tokenId The ID of the NFT.
     * @param _accountAddress Address of the main account.
     */
    function setMainAccount(uint256 tokenId, address _accountAddress) public {
        require(msg.sender == ownerOf(tokenId), "Not NFT Owner");
        mainAccount[tokenId] = _accountAddress;
    }

    /**
     * @notice Set default account implementation.
     * @param _accountAddress Address of the default account implementation.
     * @dev Only the owner can set this.
     */
    function setDefaultAccountImplementation( address _accountAddress) public onlyOwner {
        defaultAccountImplementation = _accountAddress;
    }

    /**
     * @notice Provides the URI for a specific NFT.
     * @param id The ID of the NFT.
     * @return _tokenURI URI of the NFT.
     */
    function tokenURI(uint256 id) public view override returns (string memory _tokenURI) {
        require(_exists(id), "not exist");
        NFTDescriptor.SVGParams memory _svgParams = NFTDescriptor.SVGParams({
            chainId: block.chainid,
            tokenId: id,
            color_1: color_1[id],
            color_2: color_2[id],
            color_3: color_3[id],
            color_4: color_4[id],
            implementation: tokenIdToDefaultAccountImplementation[id],
            owner: ownerOf(id),
            mainAccount: mainAccount[id]
        });

        _tokenURI = NBADescriptor(tokenDescriptor).constructTokenURI(_svgParams);
    }

    /**
     * @notice Sets the maximum amount of NFTs that can be minted in one transaction.
     * @param _newMaxSupply New max mint amount.
     * @dev Only the owner can change this.
     */
    function setMaxSupply(uint256 _newMaxSupply) public onlyOwner {
        maxSupply = _newMaxSupply;
    }

    /**
     * @notice Allows the owner to withdraw the contract's balance.
     * @dev Only the owner can call this.
     */
    function withdraw() public onlyOwner {
        uint256 balance = address(this).balance;
        uint256 buidlGuidlShare = balance * BUIDLGUIDL_ALLOCATION_BASIS_POINTS / BASIS_POINTS;
        payable(team).transfer(balance - buidlGuidlShare);
        payable(buidlGuidl).transfer(buidlGuidlShare);
    }

}