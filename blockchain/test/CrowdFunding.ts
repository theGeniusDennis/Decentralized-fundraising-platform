import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import {expect} from "chai";
import {ethers} from "hardhat";
import hre from "hardhat";

describe("Crowdfunding", function(){

    async function deployCrowdfunding(){
        
        const [owner, addr1, addr2] = await hre.ethers.getSigners();

       const Crowdfunding = await hre.ethers.getContractFactory("CrowdingFunding");
        const crowdfunding = await Crowdfunding.deploy();

        // await crowdfunding.deployed();

        return {crowdfunding, owner, addr1, addr2}

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

        it("It should accept contributions and keep track of total amount raised", async function(){
            //create a simple campaign
        const goal = ethers.parseEther('10');
        const date = new Date('December 31, 2024, 00:00:00 UTC');
        const deadline =  Math.floor(date.getTime()/1000);

        const {crowdfunding, addr1} = await loadFixture(deployCrowdfunding);
        await crowdfunding.createCampaign(goal, deadline);
        const campaign = await crowdfunding.campaigns(1);


        //make a contribution
        const contribution = ethers.parseEther("5");
        await crowdfunding.connect(addr1).contribute(1, {value: contribution})

        //check contribution and amount raised
        const addr1Contribution = await crowdfunding.contributions(1, addr1.address);

        expect(addr1Contribution).to.equal(contribution);
        expect(campaign.amountRaised).to.equal(contribution);

            
        })
    
    
   

})