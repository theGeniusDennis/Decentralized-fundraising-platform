import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";


export default buildModule("CrowdFunding", (m) => {
    const crowdfunding = m.contract("CrowdFunding");

    return {crowdfunding};
})


