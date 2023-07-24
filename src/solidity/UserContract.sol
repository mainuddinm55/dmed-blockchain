// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.7;

contract UserContract {
    struct User {
        string key;
        string email;
        string data;
    }

    struct Authentication {
        address to;
        string data;
        bool hasAccess;
    }

    mapping(address => User) users;

    mapping(address => mapping(address => Authentication)) authentications;

    mapping(address => string[]) datas;

    constructor() {}

    function login(
        address _addr,
        string memory _email,
        string memory _key
    ) public view returns (User memory) {
        require(
            keccak256(abi.encodePacked(users[_addr].email)) ==
                keccak256(abi.encodePacked(_email)),
            "User does not exits"
        );
        require(
            keccak256(abi.encodePacked(users[_addr].key)) ==
                keccak256(abi.encodePacked(_key)),
            "Password does not match"
        );
        return users[_addr];
    }

    function registration(
        address _addr,
        string memory _email,
        string memory _key,
        string memory _data
    ) public {
        require(
            keccak256(abi.encodePacked(users[_addr].email)) !=
                keccak256(abi.encodePacked(_email)),
            "User already exists."
        );
        users[_addr] = User(_key, _email, _data);
    }

    function hasShareEntity(
        address _from,
        address _to
    ) private view returns (bool) {
        return authentications[_from][_to].hasAccess;
    }

    function share(address _from, address _to, string memory _data) public {
        if (hasShareEntity(_from, _to)) {
            authentications[_from][_to].data = _data;
            authentications[_from][_to].hasAccess = true;
        } else {
            authentications[_from][_to] = Authentication(_to, _data, true);
        }
    }

    function removeShare(address _from, address _to) public {
        if (!hasShareEntity(_from, _to)) {
            revert();
        }
        authentications[_from][_to].hasAccess = false;
    }

    function isAuthorized(
        address _from,
        address _to
    ) public view returns (Authentication memory) {
        if (hasShareEntity(_from, _to)) {
            return authentications[_from][_to];
        }
        revert("Unauthorized");
    }

    function store(address _addr, string memory _data) public {
        datas[_addr].push(_data);
    }

    function getData(address _addr) public view returns (string[] memory) {
        return datas[_addr];
    }
}
