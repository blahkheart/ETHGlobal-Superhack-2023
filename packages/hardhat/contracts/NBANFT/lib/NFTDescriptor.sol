//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

pragma abicoder v2;

import "@openzeppelin/contracts/utils/Strings.sol";
import 'base64-sol/base64.sol';
import "./ToColor.sol";
import "./TruncateAddress.sol";

/// @notice Helper to generate SVGs
library NFTDescriptor {
    using Strings for uint256;
    using Strings for uint160;
    using ToColor for bytes3;
    using TruncateAddress for string;

    struct SVGParams {
        uint256 chainId;
        uint256 tokenId;
        bytes3 color_1;
        bytes3 color_2;
        bytes3 color_3;
        bytes3 color_4;
        address implementation;
        address mainAccount;
        address owner;
    }

    // @dev generate SVG header
    function generateSVGHead() private pure returns (string memory) {
        return
            string(
                abi.encodePacked(
                    '<svg xmlns="http://www.w3.org/2000/svg" width="290" height="350" viewBox="0 0 290 350" xmlns:xlink="http://www.w3.org/1999/xlink">'
                )
            );
    }

    function generateSVGDef() private pure returns (string memory svg) {
        svg = string(
            abi.encodePacked(
                '<defs>',
                '<clipPath id="corners"><rect width="290" height="350" rx="42" ry="42"/>',
                '</clipPath></defs>'
            )
        );
    }

    function generateSVGBackground() private pure returns (string memory svg) {
        svg = string(
            abi.encodePacked(
                '<g id="background" clip-path="url(#corners)">',
                '<rect fill="1f9840" x="0px" y="0px" width="290px" height="350px"/>',
                '<rect style="filter: url(#f1)" x="0px" y="0px" width="290px" height="350px"/>',
                '<rect x="0" y="0" width="290" height="350" rx="42" ry="42" fill="rgba(0,0,0,0)" stroke="rgba(255,255,255,0.2)"/></g>'
            )
        );
    }

    function generateSVGInnerBorder() private pure returns (string memory svg) {
        svg = string(
            abi.encodePacked(
                '<g id="inner-border">',
                '<rect x="16" y="16" width="258" height="317" rx="26" ry="26" fill="rgba(0,0,0,0)" stroke="rgba(255,255,255,0.2)"/></g>'
            )
        );
    }

    function generateSVGCircle() private pure returns (string memory svg) {
        svg = string(
            abi.encodePacked(
                '<g id="circle">',
                '<circle cx="139px" cy="100px" r="51px" fill="none" stroke="white"/></g>'
            )
        );
    }
    
    function generateSVGInnerCircle_1(bytes3 _color) private pure returns (string memory svg) {
        svg = string(
            abi.encodePacked(
                '<g id="inner-circle-1">',
                '<circle cx="162px" cy="73px" r="8px" fill="#',
                _color.toColor(),
                '"/></g>'
            )
        );
    }
    
    function generateSVGInnerCircle_2(bytes3 _color) private pure returns (string memory svg) {
        svg = string(
            abi.encodePacked(
                '<g id="inner-circle-2">',
                '<circle cx="137px" cy="97px" r="15px" fill="#',
               _color.toColor(),
                '"/></g>'
            )
        );
    }

    function generateSVGInnerCircle_3(bytes3 _color) private pure returns (string memory svg) {
        svg = string(
            abi.encodePacked(
                '<g id="inner-circle-3">',
                '<circle cx="105px" cy="98px" r="9px" fill="#',
               _color.toColor(),
                '"/></g>'
            )
        );
    }

    function generateSVGInnerCircle_4(bytes3 _color) private pure returns (string memory svg) {
        svg = string(
            abi.encodePacked(
                '<g id="inner-circle-4">',
                '<circle cx="142px" cy="138px" r="12px" fill="#',
               _color.toColor(),
                '"/></g>'
            )
        );
    }

    function generateSVGID(uint256 _tokenId) private pure returns (string memory svg) {
        svg = string(
            abi.encodePacked(
                '<g id="Id-text" style="transform:translate(29px, 220px)">',
                '<rect width="85px" height="26px" rx="8px" ry="8px" fill="rgba(0,0,0,0.6)"/>',
                '<text x="12px" y="17px" font-family="',
                "'Courier New', monospace",
                '" font-size="20px" fill="white">',
                '<tspan fill="rgba(255,255,255,0.6)">ID: </tspan>',
                unicode'💎',
                _tokenId.toString(),
                '</text></g>'
            )
        );
    }

    function generateSVGMainAccount(address _account) private pure returns (string memory svg) {
        string memory _accountAddress = _account == address(0) ? "Not set" : uint160(_account).toHexString(20).truncateAddress();
        svg = string(
            abi.encodePacked(
                '<g id="account-text" style="transform:translate(29px, 255px)">',
                '<rect width="218px" height="26px" rx="8px" ry="8px" fill="rgba(0,0,0,0.6)"/>',
                '<text x="12px" y="17px" font-family="',
                "'Courier New', monospace",
                '" font-size="12px" fill="white">',
                '<tspan fill="rgba(255,255,255,0.6)">Main Acc',
                unicode'💼',
                ': </tspan>',
                _accountAddress,
                '</text></g>'
            )
        );
    }

    function generateSVGOwner(address _owner) internal  pure returns (string memory svg) {
        string memory _ownerAddress =uint160( _owner).toHexString(20);
        svg = string(
            abi.encodePacked(
                '<g id="owner-text" style="transform:translate(29px, 288px)">',
                '<rect width="218px" height="26px" rx="8px" ry="8px" fill="rgba(0,0,0,0.6)"/>',
                '<text x="12px" y="17px" font-family="',
                "'Courier New', monospace",
                '" font-size="12px" fill="white">',
                '<tspan fill="rgba(255,255,255,0.6)">Owner',
                unicode'🤖',
                ': </tspan>',
                _ownerAddress.truncateAddress(),
                '</text></g>'
            )
        );
    }

    function generateSVGImage(SVGParams memory _svgParams) internal pure returns (string memory svg) {
        return string(
            abi.encodePacked(
                generateSVGHead(),
                generateSVGDef(),
                generateSVGBackground(),
                generateSVGInnerBorder(),
                generateSVGCircle(),
                generateSVGInnerCircle_1(_svgParams.color_1),
                generateSVGInnerCircle_2(_svgParams.color_2),
                generateSVGInnerCircle_3(_svgParams.color_3),
                generateSVGInnerCircle_4(_svgParams.color_4),
                generateSVGID(_svgParams.tokenId),
                generateSVGMainAccount(_svgParams.mainAccount),
                generateSVGOwner(_svgParams.owner),
                "</svg>"
            )
        );
  }

    // @dev generate Json Metadata description
    function generateDescription(SVGParams memory params) internal pure returns (string memory) {
        return
            string(
                abi.encodePacked(
                    "This NFT has ID #",
                    params.tokenId.toString(),
                    " and is owned by ",
                    unicode"🤖",
                    uint160(params.owner).toHexString(20),
                    '\\n',
                    "NBA NFT is an experiment",
                    unicode"🧪",
                    " at combining digital ownership with self-governing capabilities"
                )
            );
    }

    /// @dev generate Json Metadata attributes
    function generateAttributes(SVGParams memory _svgParams) internal pure returns (string memory) {
        return
            string(
                abi.encodePacked(
                    "[",
                    getJsonAttribute("Chain ID", _svgParams.chainId.toString(), false),
                    getJsonAttribute("Default Implementation",uint160(_svgParams.implementation).toHexString(20), false),
                    abi.encodePacked(
                        getJsonAttribute("Main Account", uint160(_svgParams.mainAccount).toHexString(20), false),
                        getJsonAttribute("Owner", uint160(_svgParams.owner).toHexString(20), true),
                        "]"
                    )
                    
                )
            );
    }

    /// @dev Get the json attribute as
    ///    {
    ///      "trait_type": "Skin",
    ///      "value": "Human"
    ///    }
    function getJsonAttribute(
        string memory trait,
        string memory value,
        bool end
    ) private pure returns (string memory json) {
        return string(abi.encodePacked('{ "trait_type" : "', trait, '", "value" : "', value, '" }', end ? "" : ","));
    }
}