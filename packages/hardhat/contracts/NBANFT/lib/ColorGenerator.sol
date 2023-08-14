//SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

/// @title ColorGenerator
/// @notice This library is used to generate colors for NBA NFTs.
/// @dev The generated colors are based on predictable randomness.
library ColorGenerator {

    /**
     * @notice Generates colors for a given tokenId and stores them in the provided mappings.
     * @param _tokenId The tokenId for which the colors will be generated.
     * @param color_1 Mapping to store the first color.
     * @param color_2 Mapping to store the second color.
     * @param color_3 Mapping to store the third color.
     * @param color_4 Mapping to store the fourth color.
     */
    function generateColors(
        uint256 _tokenId,
        mapping(uint256 => bytes3) storage color_1,
        mapping(uint256 => bytes3) storage color_2,
        mapping(uint256 => bytes3) storage color_3,
        mapping(uint256 => bytes3) storage color_4
    ) internal {
        bytes32 predictableRandom = keccak256(
            abi.encodePacked(
                _tokenId,
                blockhash(block.number - 1),
                msg.sender,
                block.timestamp,
                address(this) // This will refer to the calling contract's address
            )
        );

        color_1[_tokenId] = bytes2(predictableRandom[0]) |
            (bytes2(predictableRandom[1]) >> 4) |
            (bytes3(predictableRandom[2]) >> 8);

        color_2[_tokenId] = bytes2(predictableRandom[3]) |
            (bytes2(predictableRandom[2]) >> 16) |
            (bytes3(predictableRandom[1]) >> 8);

        color_3[_tokenId] = bytes2(predictableRandom[2]) |
            (bytes2(predictableRandom[0]) >> 8) |
            (bytes3(predictableRandom[1]) >> 16);

        color_4[_tokenId] = bytes2(predictableRandom[4]) |
            (bytes2(predictableRandom[5]) >> 4) |
            (bytes3(predictableRandom[6]) >> 16);
    }
}