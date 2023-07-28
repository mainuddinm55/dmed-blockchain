// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

contract PatientDataManager {
    struct User {
        string email;
        string password;
        string u_type;
        string public_info;
        bool exists;
    }

    struct Authentication {
        address to;
        uint256 timestamp;
        string rule;
        string cred;
        bool has_access;
    }

    mapping(address => User) private users;
    User[] private all_users;
    mapping(address => string) private user_private_infos;

    mapping(address => mapping(address => Authentication)) authentications;
    mapping(address => string[]) datas;

    function login(
        address _addr,
        string memory _email,
        string memory _password
    ) public view returns (User memory, string memory) {
        require(
            keccak256(abi.encodePacked(users[_addr].email)) ==
                keccak256(abi.encodePacked(_email)),
            "User does not exits"
        );
        require(
            keccak256(abi.encodePacked(users[_addr].password)) ==
                keccak256(abi.encodePacked(_password)),
            "Password does not match"
        );
        return (users[_addr], user_private_infos[_addr]);
    }

    function getUsers() public view returns (User[] memory) {
        return all_users;
    }

    function registration(
        address _addr,
        string memory _email,
        string memory _password,
        string memory _u_type,
        string memory _public_info,
        string memory _private_info
    ) public {
        require(
            keccak256(abi.encodePacked(users[_addr].email)) !=
                keccak256(abi.encodePacked(_email)),
            "User already exists"
        );
        require(
            !users[_addr].exists,
            "Another user already exits with this address"
        );

        User memory user = User(_email, _password, _u_type, _public_info, true);
        users[_addr] = user;
        user_private_infos[_addr] = _private_info;
        all_users.push(user);
    }

    function hasShareEntity(
        address _from,
        address _to
    ) private view returns (bool) {
        return authentications[_from][_to].has_access;
    }

    function share(
        address _from,
        address _to,
        uint256 _timestamp,
        string memory _rule,
        string memory _cred
    ) public {
        if (hasShareEntity(_from, _to)) {
            authentications[_from][_to].timestamp = _timestamp;
            authentications[_from][_to].has_access = true;
            if (
                keccak256(abi.encodePacked(authentications[_from][_to].rule)) !=
                keccak256(abi.encodePacked("BOTH"))
            ) {
                authentications[_from][_to].rule = "BOTH";
            }
        } else {
            authentications[_from][_to] = Authentication(
                _to,
                _timestamp,
                _rule,
                _cred,
                true
            );
        }
    }

    function removeShare(address _from, address _to) public {
        if (!hasShareEntity(_from, _to)) {
            revert();
        }
        authentications[_from][_to].has_access = false;
    }

    function isAuthorized(
        address _from,
        address _to
    ) public view returns (Authentication memory) {
        if (
            hasShareEntity(_from, _to) &&
            authentications[_from][_to].timestamp >= block.timestamp
        ) {
            return authentications[_from][_to];
        }
        revert("Unauthorized");
    }

    function getShare(
        address _from,
        address _to
    ) public view returns (Authentication memory, uint256) {
        return (authentications[_from][_to], block.timestamp);
    }

    function hasReadAccess(
        address _from,
        address _to
    ) private view returns (bool) {
        if (_from == _to) return true;
        if (
            hasShareEntity(_from, _to) &&
            authentications[_from][_to].timestamp >= block.timestamp &&
            (keccak256(abi.encodePacked(authentications[_from][_to].rule)) ==
                keccak256(abi.encodePacked("BOTH")) ||
                keccak256(abi.encodePacked(authentications[_from][_to].rule)) ==
                keccak256(abi.encodePacked("READ")))
        ) {
            return true;
        }
        return false;
    }

    function hasWriteAccess(
        address _from,
        address _to
    ) private view returns (bool) {
        if (_from == _to) return true;
        if (
            hasShareEntity(_from, _to) &&
            authentications[_from][_to].timestamp >= block.timestamp &&
            (keccak256(abi.encodePacked(authentications[_from][_to].rule)) ==
                keccak256(abi.encodePacked("BOTH")) ||
                keccak256(abi.encodePacked(authentications[_from][_to].rule)) ==
                keccak256(abi.encodePacked("WRITE")))
        ) {
            return true;
        }
        return false;
    }

    function store(address _from, address _to, string memory _data) public {
        if (hasWriteAccess(_from, _to)) {
            datas[_from].push(_data);
        } else {
            revert("Unauthorized");
        }
    }

    function getData(
        address _from,
        address _to
    ) public view returns (string[] memory) {
        if (hasReadAccess(_from, _to)) {
            return datas[_from];
        } else {
            revert("Unauthorized");
        }
    }
}
