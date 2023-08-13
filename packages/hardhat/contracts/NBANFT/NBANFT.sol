// SPDX-License-Identifier: MIT
pragma solidity ^0.8.8;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "base64-sol/base64.sol";
error ERC721Metadata__URI_QueryFor_NonExistentToken();

contract NBANFT is ERC721, Ownable {
	uint256 private s_tokenCounter;
	string private s_imageURI;

	constructor(string memory image) ERC721("NBA NFT", "NBA") {
		s_imageURI = svgToImageURI(image);
	}

	function mintNft() public {
		_safeMint(msg.sender, s_tokenCounter);
		s_tokenCounter = s_tokenCounter + 1;
	}

	function svgToImageURI(
		string memory svg
	) public pure returns (string memory) {
		string memory baseURL = "data:image/svg+xml;base64,";
		string memory svgBase64Encoded = Base64.encode(
			bytes(string(abi.encodePacked(svg)))
		);
		return string(abi.encodePacked(baseURL, svgBase64Encoded));
	}

	function _baseURI() internal pure override returns (string memory) {
		return "data:application/json;base64,";
	}

	function tokenURI(
		uint256 tokenId
	) public view virtual override returns (string memory) {
		if (!_exists(tokenId)) {
			revert ERC721Metadata__URI_QueryFor_NonExistentToken();
		}
		return
			string(
				abi.encodePacked(
					_baseURI(),
					Base64.encode(
						bytes(
							abi.encodePacked(
								'{"name":"',
								name(), // You can add whatever name here
								'", "description":"NBA NFT", ',
								'"attributes": [{"trait_type": "coolness", "value": 100}], "image":"',
								s_imageURI,
								'"}'
							)
						)
					)
				)
			);
	}

	function getTokenCounter() public view returns (uint256) {
		return s_tokenCounter;
	}
}
