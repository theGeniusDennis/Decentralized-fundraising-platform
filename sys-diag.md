User role: creating a fundraiser
--  the creator should indicate who the fundraising is intended for
-- if the funds it's for a different entity/person, the account address of the entity used be        provided otherwise the default person is used(the creator  of the fundraiser)
-- the amount wanted should be inputed
-- a description of the fundraising campaign should be provided
-- 


User role: Investor
-- The investor should be able to browse through the fund raising platforms
-- The description of the campaign should be showned
-- The amount raised should be displayed
-- The investor should be able to send some ethers when he wants that campaign


[circles.sdk, metamask connection]Frontend --> [Web3.js] --> [circles]Smart contracts[thegraph] -->  


[smart contracts] == 
        -->Struct for campaign

        -->Mappings: -->Maps campaigne IDs to corresponding Campaigne struct
                     --> Maps contributors to their contributions

        --> Functions: --> createCampaign
                       -->contribute 
                       -->withdrawFunds
                       -->getCampaigneDetails
        --> Events: --> campaigneCreated, contributionMade, fundsWithdrawn
                    






contract address: 0xC7BFC25FDf8Ec9B202b407BF424E394f1621b5da
Sourcify: https://repo.sourcify.dev/contracts/partial_match/11155111/0x96D63F6168fe2D56f62209e81BDb5f3A42dd504b/