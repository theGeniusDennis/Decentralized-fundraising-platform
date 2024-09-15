// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract CrowdingFunding {
  struct Campaign {
    // Struct for the creator
    address payable creator;
    uint goal;
    uint amountRaised;
    uint deadline;
    bool isCompleted;
  }

  // Mappings to keep track of campaigns and [campaign ids to funders and contributions]
  mapping(uint => Campaign) public campaigns;
  mapping(uint => mapping(address => uint)) public contributions;

  // ID to keep track of campaigns
  uint public campaignCount;

  // Events
  event campaignCreated(uint campaignId, address creator, uint goal, uint deadline);
  event contributionMade(uint campaignId, address contributor, uint amount);
  event fundsWithdrawn(uint campaignId, uint amount);

  // Functionality
  function createCampaign(uint _goal, uint _deadline) external {
    require(_goal > 0, "The goal should be greater than zero");

    campaignCount++;

    campaigns[campaignCount] = Campaign({
      creator: payable(msg.sender),
      goal: _goal,
      amountRaised: 0,
      deadline: block.timestamp + _deadline,
      isCompleted: false
    });

    emit campaignCreated(campaignCount, msg.sender, _goal, block.timestamp + _deadline);
  }

  function contribute(uint _campaignId) external payable {
    Campaign storage campaign = campaigns[_campaignId];

    require(block.timestamp < campaign.deadline, "Campaign has ended!");
    require(msg.value > 0, "Contribution should be greater than zero");

    contributions[_campaignId][msg.sender] += msg.value;
    campaign.amountRaised += msg.value;

    emit contributionMade(_campaignId, msg.sender, msg.value);
  }

  function withdrawFunds(uint _campaignId) external {
    Campaign storage campaign = campaigns[_campaignId];

    require(msg.sender == campaign.creator, "Only creator can withdraw funds");
    require(block.timestamp > campaign.deadline, "The campaign has not ended!");
    require(campaign.amountRaised >= campaign.goal, "Goal not met");
    require(!campaign.isCompleted, "Funds already withdrawn!");

    campaign.isCompleted = true;

    uint amount = campaign.amountRaised;
    campaign.creator.transfer(amount);

    emit fundsWithdrawn(_campaignId, amount);
  }

  function getCampaignDetails(uint _campaignId) external view returns (address, uint, uint, uint, bool) {
    Campaign storage campaign = campaigns[_campaignId];
    return (campaign.creator, campaign.goal, campaign.amountRaised, campaign.deadline, campaign.isCompleted);
  }

  function getContribution(uint _campaignId, address contributor) public view returns (uint) {
    return contributions[_campaignId][contributor];
  }
}
