import { expect } from "chai";
import { ethers } from "hardhat";
import { GatedNFT } from "../typechain-types";
import type { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";

describe("GatedNFT", function () {
  let gatedNFT: GatedNFT;
  let owner: SignerWithAddress;
  let addr1: SignerWithAddress;
  let addr2: SignerWithAddress;
  let addresses: SignerWithAddress[];

  beforeEach(async function () {
    [owner, addr1, addr2, ...addresses] = await ethers.getSigners();
    const GatedNFTFactory = await ethers.getContractFactory("GatedNFT");
    gatedNFT = (await GatedNFTFactory.deploy(
      "GatedNFT",
      "GNFT",
      owner.address
    )) as unknown as GatedNFT;
  });

  describe("Email Registration", function () {
    it("Should allow a user to register an email", async function () {
      await gatedNFT.connect(addr1).registerEmail("user1@example.com");
      expect(
        await gatedNFT.emailToAddress(
          ethers.keccak256(ethers.toUtf8Bytes("user1@example.com"))
        )
      ).to.equal(addr1.address);
    });

    it("Should prevent registering the same email twice", async function () {
      await gatedNFT.connect(addr1).registerEmail("user1@example.com");
      await expect(
        gatedNFT.connect(addr2).registerEmail("user1@example.com")
      ).to.be.revertedWith("Email already registered");
    });

    it("Should prevent an address from registering multiple emails", async function () {
      await gatedNFT.connect(addr1).registerEmail("user1@example.com");
      await expect(
        gatedNFT.connect(addr1).registerEmail("user2@example.com")
      ).to.be.revertedWith("Address already registered with an email");
    });
  });

  describe("Staking Mechanism", function () {
    beforeEach(async function () {
      await gatedNFT.connect(owner).mint(addr1.address, 1);
    });

    it("Should allow the owner to stake an NFT", async function () {
      await gatedNFT.connect(addr1).stake(1);
      const stakeInfo = await gatedNFT.stakingInfo(1);
      expect(stakeInfo).to.be.gt(0);
    });

    it("Should not allow non-owners to stake an NFT", async function () {
      await expect(gatedNFT.connect(addr2).stake(1)).to.be.revertedWith(
        "Not owner or delegated"
      );
    });

    it("Should recognize when staking duration is met", async function () {
      await gatedNFT.connect(addr1).stake(1);

      // Increase time by 7 days
      await ethers.provider.send("evm_increaseTime", [7 * 24 * 60 * 60]);
      await ethers.provider.send("evm_mine", []);

      expect(await gatedNFT.isStakingDurationMet(1)).to.be.true;
    });

    it("Should reset staking on transfer", async function () {
      await gatedNFT.connect(addr1).stake(1);
      expect(await gatedNFT.isStakingDurationMet(1)).to.be.false;

      await gatedNFT
        .connect(addr1)
        .transferFrom(addr1.address, addr2.address, 1);
      expect(await gatedNFT.isStakingDurationMet(1)).to.be.false;
    });
  });

  describe("Delegation", function () {
    beforeEach(async function () {
      await gatedNFT.connect(owner).mint(addr1.address, 1);
    });

    it("Should allow the owner to delegate access", async function () {
      await gatedNFT.connect(addr1).delegate(1, addr2.address);
      expect(await gatedNFT.isDelegated(1, addr2.address)).to.be.true;
    });

    it("Should allow delegated address to stake NFT", async function () {
      await gatedNFT.connect(addr1).delegate(1, addr2.address);
      const ownerOfToken = await gatedNFT.connect(owner).ownerOf(1);
      console.log("addr1: ", addr2.address);
      console.log("owner of token: ", ownerOfToken);
      await gatedNFT.connect(addr2).stake(1);
      const stakeInfo = await gatedNFT.stakingInfo(1);
      expect(stakeInfo).to.be.gt(0);
    });

    it("Should prevent non-delegated addresses from staking", async function () {
      await expect(gatedNFT.connect(addr2).stake(1)).to.be.revertedWith(
        "Not owner or delegated"
      );
    });
  });
});
