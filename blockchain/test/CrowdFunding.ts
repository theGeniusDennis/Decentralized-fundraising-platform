import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import {expect} from "chai";
import {ethers} from "hardhat";
import hre from "hardhat";

describe("Crowdfunding", function(){

    async function deployCrowdfunding(){
        
        const [owner, addr1, addr2, gh] = await hre.ethers.getSigners();

       const Crowdfunding = await hre.ethers.getContractFactory("CrowdFunding");
        const crowdfunding = await Crowdfunding.deploy();

        // await crowdfunding.deployed();
        

        return {crowdfunding, owner, addr1, addr2, gh}

    }
    

        it("Should create a contract with correct details", async function(){
           
        const goal = ethers.parseEther('10');
        const date = new Date('December 31, 2024, 00:00:00 UTC');
        const deadline =  Math.floor(date.getTime()/1000);

        const {crowdfunding, owner} = await loadFixture(deployCrowdfunding);

        await crowdfunding.createCampaign(goal, deadline);

        const campaign =  await crowdfunding.campaigns(1);
            expect(campaign.creator).to.be.equal(owner.address);
            expect(campaign.goal).to.be.equal(goal);
            expect(campaign.amountRaised).to.be.equal(0);
            expect(campaign.deadline).to.be.above(await ethers.provider.getBlock("latest").then(b=>b?.timestamp));
            expect(campaign.isCompleted).to.be.equal(false);
        })



        it("It should accept contributions", async function(){
            //create a simple campaign
        const goal = ethers.parseEther('10');
        const date = new Date('December 31, 2024, 00:00:00 UTC');
        const deadline =  Math.floor(date.getTime()/1000);

        const {crowdfunding, addr1} = await loadFixture(deployCrowdfunding);
        await crowdfunding.createCampaign(goal, deadline);
        const contributionAmount = ethers.parseEther("1");

        
         await expect(crowdfunding.connect(addr1).contribute(1, {value: contributionAmount})).to.emit(crowdfunding,"contributionMade").withArgs(1, addr1.address, contributionAmount);
      

        const campaign = await crowdfunding.campaigns(1);
        expect(campaign.amountRaised).to.equal(contributionAmount);

        })

        it("should allow creator to withdraw funds", async function(){
            const goal = ethers.parseEther("2");
            const date = new Date('Noverber 26, 2024, 00:00:00 UTC');
            const deadline = Math.floor(date.getTime()/1000);


            const {crowdfunding, addr1} = await loadFixture(deployCrowdfunding);
            await crowdfunding.createCampaign(goal, deadline);


            const contributionAmount = ethers.parseEther("5");

            await crowdfunding.connect(addr1).contribute(1, { value: contributionAmount });

            await ethers.provider.send("evm_increaseTime", [deadline + 1]);
            await ethers.provider.send("evm_mine", []);

            await expect(crowdfunding.withdrawFunds(1))
            .to.emit(crowdfunding, "fundsWithdrawn")
            .withArgs(1, contributionAmount);

            const campaign = await crowdfunding.campaigns(1);
            expect(campaign.isCompleted).to.equal(true);
        })

        it("should not allow contributions after the deadline", async () => {
            const goal = ethers.parseEther("5");
            const deadline = 60; // 60 seconds


            const {crowdfunding, addr1} = await loadFixture(deployCrowdfunding);
            await crowdfunding.createCampaign(goal, deadline);
        
            const contributionAmount = ethers.parseEther("1");
        
            await ethers.provider.send("evm_increaseTime", [deadline + 1]);
            await ethers.provider.send("evm_mine", []);
        
            await expect(
              crowdfunding.connect(addr1).contribute(1, { value: contributionAmount })
            ).to.be.revertedWith("Campaign has ended!");
          });



          it("should not allow withdrawals before the campaign ends", async () => {
            const goal = ethers.parseEther("5");
            const deadline = 60 * 60 * 24 * 30; // 30 days

            const {crowdfunding, addr1} = await loadFixture(deployCrowdfunding);
        
            await crowdfunding.createCampaign(goal, deadline);
        
            const contributionAmount = ethers.parseEther("5");
        
            await crowdfunding.connect(addr1).contribute(1, { value: contributionAmount });
        
            await expect(crowdfunding.withdrawFunds(1)).to.be.revertedWith("The campaign has not ended!");
          });



          it("should not allow non-creators to withdraw funds", async () => {
            const goal = ethers.parseEther("5");
            const deadline = 60; // 60 seconds

            const {crowdfunding, addr1} = await loadFixture(deployCrowdfunding);

        
            await crowdfunding.createCampaign(goal, deadline);
        
            const contributionAmount = ethers.parseEther("5");
        
            await crowdfunding.connect(addr1).contribute(1, { value: contributionAmount });
        
            await ethers.provider.send("evm_increaseTime", [deadline + 1]);
            await ethers.provider.send("evm_mine", []);
        
            await expect(crowdfunding.connect(addr1).withdrawFunds(1)).to.be.revertedWith("Only creator can withdraw funds");
          });
        

})