// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/// @createdBy: manifold.xyz
/// @ModifiedBy: dannithomx.eth

import "@openzeppelin/contracts/interfaces/IERC1271.sol";
import "@openzeppelin/contracts/utils/cryptography/SignatureChecker.sol";
import "@openzeppelin/contracts/utils/introspection/IERC165.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";
import "@openzeppelin/contracts/token/ERC1155/IERC1155Receiver.sol";

import "./interfaces/IERC6551Account.sol";
import "./interfaces/IERC6551Executable.sol";
import "./lib/ERC6551AccountLib.sol";

/**
 * @title ERC6551Account
 * @notice A lightweight smart contract wallet implementation of ERC6551Account
 */
contract ERC6551Account is
    IERC165,
    IERC721Receiver,
    IERC1155Receiver,
    IERC6551Account,
    IERC6551Executable,
    IERC1271
{

    uint256 public state;

    receive() external payable {}

    /**
     * @dev {See IERC6551Executable-execute}
     */
    function execute(
        address _target,
        uint256 _value,
        bytes calldata _data,
        uint256 _operation
    ) external payable override returns (bytes memory _result) {
        require(_isValidSigner(msg.sender), "Caller is not owner");
        require(_operation == 0, "Only call operations are supported");
        ++state;
        bool success;
        // solhint-disable-next-line avoid-low-level-calls
        (success, _result) = _target.call{value: _value}(_data);
        require(success, string(_result));
        return _result;
    }

    function isValidSignature(bytes32 hash, bytes memory signature)
        external
        view
        returns (bytes4 magicValue)
    {
        bool isValid = SignatureChecker.isValidSignatureNow(owner(), hash, signature);
        if (isValid) {
            return IERC1271.isValidSignature.selector;
        }

        return "";
    }

    function isValidSigner(address signer, bytes calldata) external view returns (bytes4) {
        if (_isValidSigner(signer)) {
            return IERC6551Account.isValidSigner.selector;
        }

        return bytes4(0);
    }

    function onERC721Received(
        address,
        address,
        uint256 receivedTokenId,
        bytes memory
    ) external view returns (bytes4) {
        _revertIfOwnershipCycle(msg.sender, receivedTokenId);
        return IERC721Receiver.onERC721Received.selector;
    }

    function onERC1155Received(
        address,
        address,
        uint256,
        uint256,
        bytes memory
    ) external pure returns (bytes4) {
        return IERC1155Receiver.onERC1155Received.selector;
    }

    function onERC1155BatchReceived(
        address,
        address,
        uint256[] memory,
        uint256[] memory,
        bytes memory
    ) external pure returns (bytes4) {
        return IERC1155Receiver.onERC1155BatchReceived.selector;
    }

    function supportsInterface(bytes4 interfaceId) external pure returns (bool) {
        return (interfaceId == type(IERC6551Account).interfaceId ||
            interfaceId == type(IERC6551Executable).interfaceId ||
            interfaceId == type(IERC1155Receiver).interfaceId ||
            interfaceId == type(IERC721Receiver).interfaceId ||
            interfaceId == type(IERC165).interfaceId);
    }

    /**
     * @dev {See IERC6551Account-token}
     */
    function token()
        public
        view
        override
        returns (
            uint256,
            address,
            uint256
        )
    {
        return ERC6551AccountLib.token();
    }

    /**
     * @dev {See IERC6551Account-owner}
     */
    function owner() public view returns (address) {
        (uint256 chainId, address contractAddress, uint256 tokenId) = token();
        if (chainId != block.chainid) return address(0);
        return IERC721(contractAddress).ownerOf(tokenId);
    }

    function _isValidSigner(address signer) internal view returns (bool) {
        return signer == owner();
    }

    /**
     * @dev Helper method to check if a received token is in the ownership chain of the wallet.
     * @param receivedTokenAddress The address of the token being received.
     * @param receivedTokenId The ID of the token being received.
     */
    function _revertIfOwnershipCycle(address receivedTokenAddress, uint256 receivedTokenId)
        internal
        view
    {
        (uint256 _chainId, address _contractAddress, uint256 _tokenId) = token();
        require(
            _chainId != block.chainid ||
                receivedTokenAddress != _contractAddress ||
                receivedTokenId != _tokenId,
            "Cannot own yourself"
        );

        address currentOwner = owner();
        require(currentOwner != address(this), "Token in ownership chain");
        uint256 depth = 0;
        while (currentOwner.code.length > 0) {
            try IERC6551Account(payable(currentOwner)).token() returns (
                uint256 chainId,
                address contractAddress,
                uint256 tokenId
            ) {
                require(
                    chainId != block.chainid ||
                        contractAddress != receivedTokenAddress ||
                        tokenId != receivedTokenId,
                    "Token in ownership chain"
                );
                // Advance up the ownership chain
                currentOwner = IERC721(contractAddress).ownerOf(tokenId);
                require(currentOwner != address(this), "Token in ownership chain");
            } catch {
                break;
            }
            unchecked {
                ++depth;
            }
            if (depth == 5) revert("Ownership chain too deep");
        }
    }
}