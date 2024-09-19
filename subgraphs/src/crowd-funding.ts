import {
  campaignCreated as campaignCreatedEvent,
  contributionMade as contributionMadeEvent,
  fundsWithdrawn as fundsWithdrawnEvent
} from "../generated/CrowdFunding/CrowdFunding"
import {
  campaignCreated,
  contributionMade,
  fundsWithdrawn
} from "../generated/schema"

export function handlecampaignCreated(event: campaignCreatedEvent): void {
  let entity = new campaignCreated(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.campaignId = event.params.campaignId
  entity.creator = event.params.creator
  entity.goal = event.params.goal
  entity.deadline = event.params.deadline

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handlecontributionMade(event: contributionMadeEvent): void {
  let entity = new contributionMade(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.campaignId = event.params.campaignId
  entity.contributor = event.params.contributor
  entity.amount = event.params.amount

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handlefundsWithdrawn(event: fundsWithdrawnEvent): void {
  let entity = new fundsWithdrawn(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.campaignId = event.params.campaignId
  entity.amount = event.params.amount

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}
