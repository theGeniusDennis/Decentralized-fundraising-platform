import {
  assert,
  describe,
  test,
  clearStore,
  beforeAll,
  afterAll
} from "matchstick-as/assembly/index"
import { BigInt, Address } from "@graphprotocol/graph-ts"
import { campaignCreated } from "../generated/schema"
import { campaignCreated as campaignCreatedEvent } from "../generated/CrowdFunding/CrowdFunding"
import { handlecampaignCreated } from "../src/crowd-funding"
import { createcampaignCreatedEvent } from "./crowd-funding-utils"

// Tests structure (matchstick-as >=0.5.0)
// https://thegraph.com/docs/en/developer/matchstick/#tests-structure-0-5-0

describe("Describe entity assertions", () => {
  beforeAll(() => {
    let campaignId = BigInt.fromI32(234)
    let creator = Address.fromString(
      "0x0000000000000000000000000000000000000001"
    )
    let goal = BigInt.fromI32(234)
    let deadline = BigInt.fromI32(234)
    let newcampaignCreatedEvent = createcampaignCreatedEvent(
      campaignId,
      creator,
      goal,
      deadline
    )
    handlecampaignCreated(newcampaignCreatedEvent)
  })

  afterAll(() => {
    clearStore()
  })

  // For more test scenarios, see:
  // https://thegraph.com/docs/en/developer/matchstick/#write-a-unit-test

  test("campaignCreated created and stored", () => {
    assert.entityCount("campaignCreated", 1)

    // 0xa16081f360e3847006db660bae1c6d1b2e17ec2a is the default address used in newMockEvent() function
    assert.fieldEquals(
      "campaignCreated",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "campaignId",
      "234"
    )
    assert.fieldEquals(
      "campaignCreated",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "creator",
      "0x0000000000000000000000000000000000000001"
    )
    assert.fieldEquals(
      "campaignCreated",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "goal",
      "234"
    )
    assert.fieldEquals(
      "campaignCreated",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "deadline",
      "234"
    )

    // More assert options:
    // https://thegraph.com/docs/en/developer/matchstick/#asserts
  })
})
