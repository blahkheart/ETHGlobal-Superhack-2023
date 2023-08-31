// SPDX-License-Identifier: MIT
pragma solidity ^0.8.8;

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
import "base64-sol/base64.sol";
import "./lib/ToColor.sol";
import "./lib/ColorGenerator.sol";
import "./NBADescriptor.sol";

/**
 * @title NBA NFT Contract
 * @author Danny Thomx
 * @notice This contract mints and manages the NBA NFTs.
 * @dev Ensure you're familiar with ERC721 standard before interacting with this contract.
 */

/*
TODOs
  function to pause/unpause mint
  function to set team's address
  call Registry contract during mint and create a token bound account on mint | salt = hash(address(this) + chainId + tokenId)
  set tokens default account to the account created while minting
  test withdraw function
*/

contract NBA is ERC721Enumerable, Ownable {
    using Address for address;
    using Strings for uint256;
    using Strings for uint160;
    using ToColor for bytes3;
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
    address constant team = 0xCA7632327567796e51920F6b16373e92c7823854;

    /// @dev Address of the default account implementation.
    address public defaultAccountImplementation;

    /// @dev Counter for tracking tokenIds.
    Counters.Counter private _tokenIdCounter;

    /// @dev Mapping to store colors associated with NFTs.
    mapping(uint256 => bytes3) private color_1;
    mapping(uint256 => bytes3) private color_2;
    mapping(uint256 => bytes3) private color_3;
    mapping(uint256 => bytes3) private color_4;

    /// @dev Mapping to store default accounts for each tokenId.
    mapping(uint256 => address) public tokenIdToDefaultAccountImplementation;

    /// @dev Mapping to store main accounts for each tokenId.
    mapping (uint256 => address) public mainAccount;
    
    /**
     * @notice Contract constructor to set the name and symbol for the NFT.
     * @param _name Name of the NFT.
     * @param _symbol Symbol of the NFT.
     */
    constructor(
        string memory _name,
        string memory _symbol
    ) ERC721(_name, _symbol) {  }

    /// @notice Allow the contract to receive Ether.
    receive() external payable {}

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
            if(defaultAccountImplementation != address(0)) 
                tokenIdToDefaultAccountImplementation[_tokenId] = defaultAccountImplementation;
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

        _tokenURI = NBADescriptor.constructTokenURI(_svgParams);
    }

    /**
     * @notice Sets the maximum amount of NFTs that can be minted in one transaction.
     * @param _newMaxSupply New max mint amount.
     * @dev Only the owner can change this.
     */
    function setMaxSupply(uint256 _newMaxSupply) public onlyOwner {
        maxSupply = _newMaxSupply;
    }

    // function withdraw() public payable onlyOwner {
    //     address buidlguidl = 0x97843608a00e2bbc75ab0C1911387E002565DEDE;

    //         (bool public_goods, ) = payable(buidlguidl).call{
    //             value: (address(this).balance * 15) / 100
    //         }("");
    //         require(public_goods);

    //         // This will payout the team the rest of the Revenue.
    //         (bool success, ) = payable(team).call{value: address(this).balance}("");
    //         require(success);
    // }

    /**
     * @notice Allows the owner to withdraw the contract's balance.
     * @dev Only the owner can call this.
     */
    function withdraw() public onlyOwner {
        uint256 balance = address(this).balance;
        uint256 share = balance * 15 / 100;
        payable(team).transfer(balance - share);
        payable(0x97843608a00e2bbc75ab0C1911387E002565DEDE).transfer(share); // buidlguidl address
    }

}
