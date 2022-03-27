//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";

contract Certifications is Ownable {
    struct certificate {
        string title;
        string organization;
        string candidate_name;
        uint256 creation_date;
        uint256 expiration_date;
    }

    uint256 public certificatesCounter;
    mapping(uint256 => certificate) public certificates;

    event certificateCreation(uint256 _certificateId);

    function grantCertificate(
        string memory _title,
        string memory _organization,
        string memory _candidate_name,
        uint256 _expiration_date
    ) public onlyOwner {
        require(bytes(_title).length > 0, "Enter a valid title");
        require(bytes(_organization).length > 0, "Enter a valid organization name");
        require(bytes(_candidate_name).length > 0, "Enter a valid name");
        require(_expiration_date > block.timestamp, "Entar a valid expiration date");
        certificates[certificatesCounter] = certificate(
            _title,
            _organization,
            _candidate_name,
            block.timestamp,
            _expiration_date
        );
        emit certificateCreation(certificatesCounter);
        certificatesCounter++;
    }

}
