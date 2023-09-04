// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

library TruncateAddress {

    function truncateAddress(string memory _address) internal pure returns(string memory) {
        bytes memory addressBytes = bytes(_address);
        require(addressBytes.length == 42, "Invalid address length");
        
        // Taking first 6 characters ('0x' + first 4 characters of the address) 
        // and the last 4 characters of the address.
        bytes memory result = new bytes(13);
        
        // Copying the first 6 characters
        for (uint i = 0; i < 6; i++) {
            result[i] = addressBytes[i];
        }

        // Adding the ellipsis
        result[6] = '.';
        result[7] = '.';
        result[8] = '.';

        // Copying the last 4 characters
        for (uint i = 0; i < 4; i++) {
            result[9 + i] = addressBytes[38 + i];
        }
        
        return string(result);
    }

}
