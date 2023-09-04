//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

pragma abicoder v2;

import "@openzeppelin/contracts/utils/Strings.sol";
import 'base64-sol/base64.sol';
import "./lib/NFTDescriptor.sol";

contract NBADescriptor {
    using Strings for uint256;
    using Strings for uint160;

    // @dev generate SVG header
    function constructTokenURI(NFTDescriptor.SVGParams memory params) public pure returns (string memory) {
        string memory name = string(
            abi.encodePacked("NBA #", params.tokenId.toString())
        );
        string memory image = Base64.encode(
            bytes(NFTDescriptor.generateSVGImage(params))
        );
        string memory attributes = NFTDescriptor.generateAttributes(params);
        string memory description = NFTDescriptor.generateDescription(
            params
        );
        return string(
            abi.encodePacked(
                "data:application/json;base64,",
                Base64.encode(
                    bytes(
                        abi.encodePacked(
                            '{"name":"',
                            name,
                            '", "description":"',
                            description,
                            '", "attributes": ',
                            attributes,
                            ', "image": "',
                            "data:image/svg+xml;base64,",
                            image,
                            '"}'
                        )
                    )
                )
            )
        );
    }
  
}