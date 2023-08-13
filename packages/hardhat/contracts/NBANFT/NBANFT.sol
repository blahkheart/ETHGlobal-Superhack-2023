// SPDX-License-Identifier: MIT
pragma solidity ^0.8.8;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "base64-sol/base64.sol";
import "./lib/ToColor.sol";
import "./NBADescriptor.sol";

/**
  @title NBA NFT Contract
  @author Danny Thomx
  @notice Explain to an end user what this does
  @dev Explain to a developer any extra details
*/

/*
TODOs
  function comments
  call Registry contract during mint and create a token bound account on mint | salt = hash(address(this) + chainId + tokenId)
  set tokens default account to the account created while minting
  function to pause/unpause mint
  function to set team's address
*/

contract NBA is ERC721Enumerable, Ownable {
    using Address for address;
    using Strings for uint256;
    using Strings for uint160;
    using ToColor for bytes3;
    using Counters for Counters.Counter;

    uint256 public maxSupply = 2000;
    uint256 public price = 0.02 ether;
    uint256 public maxMintAmount = 5;
    bool public paused = false;
    address constant team = 0xCA7632327567796e51920F6b16373e92c7823854;
    address public defaultAccountImplementation;
    Counters.Counter private _tokenIdCounter;

    mapping(uint256 => bytes3) public color_1;
    mapping(uint256 => bytes3) public color_2;
    mapping(uint256 => bytes3) public color_3;
    mapping(uint256 => bytes3) public color_4;
    mapping(uint256 => address) public tokenIdToDefaultAccountImplementation;
    mapping (uint256 => address) public mainAccount;
 
    constructor(
        string memory _name,
        string memory _symbol
    ) ERC721(_name, _symbol) {  }


    receive() external payable {}

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
            _generateColors(_tokenId);
            if(defaultAccountImplementation != address(0)) 
                tokenIdToDefaultAccountImplementation[_tokenId] = defaultAccountImplementation;
        }
    }

    function setMainAccount(uint256 tokenId, address _accountAddress) public {
        require(msg.sender == ownerOf(tokenId), "Not NFT Owner");
        mainAccount[tokenId] = _accountAddress;
    }

    function setDefaultAccountImplementation( address _accountAddress) public onlyOwner{
        defaultAccountImplementation = _accountAddress;
    }

    function tokenURI(
        uint256 id
    ) public view override returns (string memory _tokenURI) {
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

    function setmaxMintAmount(uint8 _newmaxMintAmount) public onlyOwner {
        maxSupply = _newmaxMintAmount;
    }

    function withdraw() public payable onlyOwner {
        address buidlguidl = 0x97843608a00e2bbc75ab0C1911387E002565DEDE;

            (bool public_goods, ) = payable(buidlguidl).call{
                value: (address(this).balance * 15) / 100
            }("");
            require(public_goods);

            // This will payout the team the rest of the Revenue.
            (bool success, ) = payable(team).call{value: address(this).balance}("");
            require(success);

    }

    function _generateColors(uint256 tokenId) private {
        // Generate a "predictable random" hash for the given tokenId
        bytes32 predictableRandom = keccak256(
            abi.encodePacked(
                tokenId,
                blockhash(block.number - 1),
                msg.sender,
                block.timestamp,
                address(this)
            )
        );

        color_1[tokenId] = bytes2(predictableRandom[0]) |
            (bytes2(predictableRandom[1]) >> 4) |
            (bytes3(predictableRandom[2]) >> 8);

        color_2[tokenId] = bytes2(predictableRandom[3]) |
            (bytes2(predictableRandom[2]) >> 16) |
            (bytes3(predictableRandom[1]) >> 8);

        color_3[tokenId] = bytes2(predictableRandom[2]) |
            (bytes2(predictableRandom[0]) >> 8) |
            (bytes3(predictableRandom[1]) >> 16);


        color_4[tokenId] = bytes2(predictableRandom[4]) |
            (bytes2(predictableRandom[5]) >> 4) |
            (bytes3(predictableRandom[6]) >> 16);

    }
}
