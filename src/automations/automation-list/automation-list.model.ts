import { createDomain, sample, guard, restore } from 'effector-logger/macro'
import { createGate } from 'effector-react'

import { config } from '~/config'
import {
  AutomationContractFragmentFragment,
  UserType,
} from '~/graphql/_generated-types'
import { userModel } from '~/users'
import * as automationUpdateModel from '~/automations/automation-update/automation-update.model'
import * as automationDeployModel from '~/automations/automation-deploy-contract/automation-deploy-contract.model'
import { automationApi } from '../common/automation.api'
import { Automates, Trigger } from '../common/automation.types'

export const automationListDomain = createDomain()

export const fetchTriggersFx = automationListDomain.createEffect(async () => {
  return automationApi.getTriggers({})
})

export const deleteTriggerFx = automationListDomain.createEffect(
  async (id: string) => {
    return automationApi.deleteTrigger({ id })
  }
)

export const toggleTriggerFx = automationListDomain.createEffect(
  async (params: { triggerId: string; active: boolean }) => {
    const data = await automationApi.updateTrigger({
      input: { id: params.triggerId, active: params.active },
    })

    if (!data) throw new Error('something went wrong')

    return data
  }
)

export const $triggers = automationListDomain
  .createStore<Trigger[]>([])
  .on(fetchTriggersFx.doneData, (_, { list }) => list)
  .on(deleteTriggerFx, (state, triggerId) =>
    state.map((trigger) =>
      trigger.id === triggerId ? { ...trigger, deleting: true } : trigger
    )
  )
  .on(automationUpdateModel.createTriggerFx.doneData, (state, payload) => [
    ...state,
    payload,
  ])
  .on(toggleTriggerFx.doneData, (state, payload) =>
    state.map((trigger) => (trigger.id === payload.id ? payload : trigger))
  )
  .on(deleteTriggerFx.done, (state, { params }) =>
    state.filter((trigger) => trigger.id !== params)
  )
  .on(automationUpdateModel.updateTriggerFx.doneData, (state, payload) =>
    state.map((trigger) => (trigger.id === payload.id ? payload : trigger))
  )
  .on(automationUpdateModel.updateActionFx.doneData, (state, payload) => {
    return state.map((trigger) => ({
      ...trigger,
      actions: {
        ...trigger.actions,
        list: trigger.actions.list?.map((action) =>
          action.id === payload.id ? payload : action
        ),
      },
    }))
  })
  .on(automationUpdateModel.createActionFx.doneData, (state, payload) => {
    return state.map((trigger) => ({
      ...trigger,
      actions: {
        ...trigger.actions,
        list: [...(trigger.actions.list ?? []), payload],
      },
    }))
  })
  .on(automationUpdateModel.updateConditionFx.doneData, (state, payload) => {
    return state.map((trigger) => ({
      ...trigger,
      conditions: {
        ...trigger.conditions,
        list: trigger.conditions.list?.map((condition) =>
          condition.id === payload.id ? payload : condition
        ),
      },
    }))
  })
  .on(automationUpdateModel.createConditionFx.doneData, (state, payload) => {
    return state.map((trigger) => ({
      ...trigger,
      conditions: {
        ...trigger.conditions,
        list: [...(trigger.conditions.list ?? []), payload],
      },
    }))
  })
  .on(
    [
      automationUpdateModel.deleteActionFx.done,
      automationUpdateModel.deleteConditonFx.done,
    ],
    (state, { params }) =>
      state.map((trigger) => ({
        ...trigger,
        actions: {
          ...trigger.actions,
          list: trigger.actions.list?.filter((action) => action.id === params),
        },
        conditions: {
          ...trigger.conditions,
          list: trigger.conditions.list?.filter(
            (condition) => condition.id === params
          ),
        },
      }))
  )

export const AutomationListGate = createGate({
  domain: automationListDomain,
  name: 'AutomationListGate',
})

sample({
  clock: AutomationListGate.open,
  target: fetchTriggersFx,
})

export const fetchAutomationContractsFx = automationListDomain.createEffect(
  async (chainId: string) => {
    const data = await automationApi.getAutomationsContracts()

    const contracts: Automates[] = await Promise.all(
      data.map(async (contract) => {
        const contractData = await automationApi.getContractInterface({
          ...contract,
          chainId,
        })

        return {
          ...contract,
          contractInterface: contractData.abi,
          address: contractData.address,
        }
      })
    )

    return contracts
  }
)

export const $automateContracts = automationListDomain
  .createStore<Record<string, Automates>>({})
  .on(fetchAutomationContractsFx.doneData, (_, payload) =>
    payload.reduce<Record<string, Automates>>((acc, automateContract) => {
      if (!automateContract.address) return acc

      return {
        ...acc,
        [automateContract.contract]: automateContract,
      }
    }, {})
  )

export const fetchContractsFx = automationListDomain.createEffect(
  async (userId: string) => {
    return automationApi.getContracts({ filter: { user: userId } })
  }
)

export const deleteContractFx = automationListDomain.createEffect(
  async (contractId: string) => {
    const isDeleted = await automationApi.deleteContract({ id: contractId })

    if (!isDeleted) throw new Error('contract is not deleted')
  }
)

export const setUpdateContract =
  automationListDomain.createEvent<AutomationContractFragmentFragment>()

export const $contracts = automationListDomain
  .createStore<(AutomationContractFragmentFragment & { deleting?: boolean })[]>(
    []
  )
  .on(fetchContractsFx.doneData, (_, { list }) => list)
  .on(automationDeployModel.deployFx.doneData, (state, payload) => [
    ...state,
    payload,
  ])
  .on(setUpdateContract, (state, payload) =>
    state.map((contract) => (contract.id === payload.id ? payload : contract))
  )
  .on(deleteContractFx, (state, payload) =>
    state.map((contract) =>
      contract.id === payload ? { ...contract, deleting: true } : contract
    )
  )
  .on(deleteContractFx.done, (state, { params }) =>
    state.filter((contract) => contract.id !== params)
  )

sample({
  clock: guard({
    source: [userModel.$user, AutomationListGate.status],
    clock: [userModel.$user.updates, AutomationListGate.open],
    filter: (source): source is [UserType, boolean] => {
      const [user, status] = source

      return Boolean(user?.id) && status
    },
  }),
  fn: ([user]) => user.id,
  target: fetchContractsFx,
})

sample({
  clock: AutomationListGate.open,
  fn: () => (config.IS_DEV ? '3' : '1'),
  target: fetchAutomationContractsFx,
})

const fetchDescriptionFx = automationListDomain.createEffect(() =>
  automationApi.getDescription()
)

export const $descriptions = restore(fetchDescriptionFx.doneData, null)

sample({
  clock: AutomationListGate.open,
  target: fetchDescriptionFx,
})
