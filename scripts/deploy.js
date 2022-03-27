const hre = require("hardhat");

async function main() {
  const [owner, _] = await hre.ethers.getSigners();
  console.log(`Deploying contract from: ${owner.address}`);
  const Certifications = await hre.ethers.getContractFactory("Certifications");
  const certsContract = await Certifications.deploy();
  await certsContract.deployed();
  console.log(`Contract deployed successfully: ${certsContract.address}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
