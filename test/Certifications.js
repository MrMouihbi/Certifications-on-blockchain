const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Certifications Contract", function () {
  let Certifications, certsContract, owner, acc1;

  beforeEach(async () => {
    Certifications = await ethers.getContractFactory("Certifications");
    certsContract = await Certifications.deploy();
    [owner, acc1, _] = await ethers.getSigners();
  });

  describe("Ownership", () => {
    it("Sets the owner", async () => {
      expect(await certsContract.owner()).to.equal(owner.address);
    });

    it("Doesn't allow not owner addresses to create certificates", async () => {
      await expect(
        certsContract
          .connect(acc1)
          .grantCertificate("Title", "Organization", "name", 1648381879)
      ).to.be.revertedWith("Ownable: caller is not the owner");

      expect(await certsContract.certificatesCounter()).to.equal(0);
    });
  });

  describe("Certification Creation", () => {
    it("Should not create a certificate without a title", async () => {
      await expect(
        certsContract.grantCertificate("", "Organization", "name", 1648381879)
      ).to.be.revertedWith("Enter a valid title");

      expect(await certsContract.certificatesCounter()).to.equal(0);
    });

    it("Should not create a certificate without an organization name", async () => {
      await expect(
        certsContract.grantCertificate("Title", "", "name", 1648381879)
      ).to.be.revertedWith("Enter a valid organization name");

      expect(await certsContract.certificatesCounter()).to.equal(0);
    });

    it("Should not create a certificate without a candidate name", async () => {
      await expect(
        certsContract.grantCertificate("Title", "Organization", "", 1648381879)
      ).to.be.revertedWith("Enter a valid name");

      expect(await certsContract.certificatesCounter()).to.equal(0);
    });

    it("Should not create a certificate with an expiration date that is before current timestamp", async () => {
      await expect(
        certsContract.grantCertificate("Title", "Organization", "name", 999)
      ).to.be.revertedWith("Entar a valid expiration date");

      expect(await certsContract.certificatesCounter()).to.equal(0);
    });

    it("Creates certification and emit creation event", async () => {
      let certificatesCounter = await certsContract.certificatesCounter();
      await network.provider.send("evm_setNextBlockTimestamp", [2000000000]);
      await expect(
        certsContract.grantCertificate(
          "Title",
          "Organization",
          "name",
          2100000001
        )
      )
        .to.emit(certsContract, "certificateCreation")
        .withArgs(certificatesCounter);

      expect(await certsContract.certificatesCounter()).to.equal(1);

      let certificate = await certsContract.certificates(0);
      expect(certificate[0]).to.equal("Title");
      expect(certificate[1]).to.equal("Organization");
      expect(certificate[2]).to.equal("name");
      expect(certificate[3]).to.equal(2000000000);
      expect(certificate[4]).to.equal(2100000001);
    });
  });
});
