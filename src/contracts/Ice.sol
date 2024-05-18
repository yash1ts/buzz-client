// SPDX-License-Identifier: MIT

pragma solidity 0.8.25;

contract IceInteraction {
    enum IceType {
        ANSWER, OFFER
    }

    struct IceData {
        uint256 id;
        IceType iceType; 
        string data;
        uint256 timestamp;
    }

    IceData[] private s_iceData;

    mapping(address => mapping(address => IceData)) private s_userIceMapping;

    event IceRequest(address indexed from, address indexed to, uint256 indexed iceId);

    function sendIce(address _to, IceType iceType, string memory _data) external {
        IceData memory iceData = IceData(s_iceData.length, iceType, _data, block.timestamp);
        s_userIceMapping[msg.sender][_to] = iceData;
        s_iceData.push(iceData);

        emit IceRequest(msg.sender, _to, s_iceData.length - 1);

        // IceData memory reverseMapping = s_userIceMapping[_to][msg.sender];
        // if (reverseMapping.iceType != iceType && reverseMapping.timestamp - iceData.timestamp < 20) {
        //     // mapping complete
        // }
    }

    function getIceAtIndex(uint256 index) external view returns (IceData memory) {
        return s_iceData[index];
    }

    function getIceRequest(address from, address to) external view returns (IceData memory) {
        return s_userIceMapping[from][to];
    }
}
