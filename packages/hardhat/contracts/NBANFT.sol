// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

// Amended by Dannithomx
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
import "./lib/ToColor.sol";
import "./NBADescriptor.sol";

/**
  @title NBA NFT Contract
  @author Danny Thomx
  @notice Explain to an end user what this does
  @dev Explain to a developer any extra details
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
    address constant dev = 0xCA7632327567796e51920F6b16373e92c7823854;
    Counters.Counter private _tokenIdCounter;

    mapping(uint256 => bytes3) public color_1;
    mapping(uint256 => bytes3) public color_2;
    mapping(uint256 => bytes3) public color_3;
    mapping(uint256 => bytes3) public color_4;
    mapping(uint256 => address) public tokenIdToImplementation;
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
        }
    }

    function setMainAccount(uint256 tokenId, address _accountAddress) public {
        require(msg.sender == ownerOf(tokenId), "Not Owner");
        mainAccount[tokenId] = _accountAddress;
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
            implementation: tokenIdToImplementation[id],
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

            // This will payout the dev the rest of the initial Revenue.
            (bool success, ) = payable(dev).call{value: address(this).balance}("");
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
