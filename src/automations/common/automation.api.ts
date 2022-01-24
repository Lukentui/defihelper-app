import { getAPIClient } from '~/api'
import { config } from '~/config'
import {
  AutomationActionCreateMutation,
  AutomationActionCreateMutationVariables,
  AutomationActionDeleteMutation,
  AutomationActionDeleteMutationVariables,
  AutomationActionUpdateMutation,
  AutomationActionUpdateMutationVariables,
  AutomationConditionCreateMutation,
  AutomationConditionCreateMutationVariables,
  AutomationConditionDeleteMutation,
  AutomationConditionDeleteMutationVariables,
  AutomationConditionUpdateMutation,
  AutomationConditionUpdateMutationVariables,
  AutomationHistoryQuery,
  AutomationHistoryQueryVariables,
  AutomationTriggerCreateMutation,
  AutomationTriggerCreateMutationVariables,
  AutomationTriggerDeleteMutation,
  AutomationTriggerDeleteMutationVariables,
  AutomationTriggerQuery,
  AutomationTriggerQueryVariables,
  AutomationTriggersQuery,
  AutomationTriggersQueryVariables,
  AutomationTriggerUpdateMutation,
  AutomationTriggerUpdateMutationVariables,
  AutomationProtocolsQueryVariables,
  AutomationProtocolsQuery,
  AutomationDescriptionQuery,
  AutomationProductsQuery,
  AutomationProductsQueryVariables,
  AutomationProductsBalanceQuery,
  AutomationProductsBalanceQueryVariables,
} from '~/graphql/_generated-types'
import { Automates } from './automation.types'
import {
  AUTOMATION_ACTION_CREATE,
  AUTOMATION_ACTION_DELETE,
  AUTOMATION_ACTION_UPDATE,
  AUTOMATION_CONDITION_CREATE,
  AUTOMATION_CONDITION_DELETE,
  AUTOMATION_CONDITION_UPDATE,
  AUTOMATION_HISTORY,
  AUTOMATION_TRIGGER,
  AUTOMATION_TRIGGERS,
  AUTOMATION_TRIGGER_CREATE,
  AUTOMATION_TRIGGER_DELETE,
  AUTOMATION_TRIGGER_UPDATE,
  AUTOMATION_PROTOCOLS,
  AUTOMATION_DESCRIPTION,
  AUTOMATION_PRODUCTS,
  AUTOMATION_PRODUCTS_BALANCE,
} from './graphql'

export const automationApi = {
  getTriggers: (variables: AutomationTriggersQueryVariables) =>
    getAPIClient()
      .query<AutomationTriggersQuery, AutomationTriggersQueryVariables>(
        AUTOMATION_TRIGGERS,
        variables
      )
      .toPromise()
      .then(({ data }) => ({
        list: data?.automateTriggers.list ?? [],
        count: data?.automateTriggers.pagination.count ?? 0,
      })),

  getTrigger: (variables: AutomationTriggerQueryVariables) =>
    getAPIClient()
      .query<AutomationTriggerQuery, AutomationTriggerQueryVariables>(
        AUTOMATION_TRIGGER,
        variables
      )
      .toPromise()
      .then(({ data }) => data?.automateTrigger),

  createTrigger: (variables: AutomationTriggerCreateMutationVariables) =>
    getAPIClient()
      .mutation<
        AutomationTriggerCreateMutation,
        AutomationTriggerCreateMutationVariables
      >(AUTOMATION_TRIGGER_CREATE, variables)
      .toPromise()
      .then(({ data }) => data?.automateTriggerCreate),

  updateTrigger: (variables: AutomationTriggerUpdateMutationVariables) =>
    getAPIClient()
      .mutation<
        AutomationTriggerUpdateMutation,
        AutomationTriggerUpdateMutationVariables
      >(AUTOMATION_TRIGGER_UPDATE, variables)
      .toPromise()
      .then(({ data }) => data?.automateTriggerUpdate),

  deleteTrigger: (variables: AutomationTriggerDeleteMutationVariables) =>
    getAPIClient()
      .mutation<
        AutomationTriggerDeleteMutation,
        AutomationTriggerDeleteMutationVariables
      >(AUTOMATION_TRIGGER_DELETE, variables)
      .toPromise()
      .then(({ data }) => data?.automateTriggerDelete),

  createCondition: (variables: AutomationConditionCreateMutationVariables) =>
    getAPIClient()
      .mutation<
        AutomationConditionCreateMutation,
        AutomationConditionCreateMutationVariables
      >(AUTOMATION_CONDITION_CREATE, variables)
      .toPromise()
      .then(({ data }) => data?.automateConditionCreate),

  updateCondition: (variables: AutomationConditionUpdateMutationVariables) =>
    getAPIClient()
      .mutation<
        AutomationConditionUpdateMutation,
        AutomationConditionUpdateMutationVariables
      >(AUTOMATION_CONDITION_UPDATE, variables)
      .toPromise()
      .then(({ data }) => data?.automateConditionUpdate),

  deleteCondition: (variables: AutomationConditionDeleteMutationVariables) =>
    getAPIClient()
      .mutation<
        AutomationConditionDeleteMutation,
        AutomationConditionDeleteMutationVariables
      >(AUTOMATION_CONDITION_DELETE, variables)
      .toPromise()
      .then(({ data }) => data?.automateConditionDelete),

  createAction: (variables: AutomationActionCreateMutationVariables) =>
    getAPIClient()
      .mutation<
        AutomationActionCreateMutation,
        AutomationActionCreateMutationVariables
      >(AUTOMATION_ACTION_CREATE, variables)
      .toPromise()
      .then(({ data }) => data?.automateActionCreate),

  updateAction: (variables: AutomationActionUpdateMutationVariables) =>
    getAPIClient()
      .mutation<
        AutomationActionUpdateMutation,
        AutomationActionUpdateMutationVariables
      >(AUTOMATION_ACTION_UPDATE, variables)
      .toPromise()
      .then(({ data }) => data?.automateActionUpdate),

  deleteAction: (variables: AutomationActionDeleteMutationVariables) =>
    getAPIClient()
      .mutation<
        AutomationActionDeleteMutation,
        AutomationActionDeleteMutationVariables
      >(AUTOMATION_ACTION_DELETE, variables)
      .toPromise()
      .then(({ data }) => data?.automateActionDelete),

  getAutomationsContracts: (
    network = 'ethereum'
  ): Promise<Omit<Automates, 'contractInterface'>[]> =>
    fetch(`${config.ADAPTERS_HOST}/automates/${network}`).then((res) =>
      res.json()
    ),

  getContractAddress: (
    variables: Omit<Automates, 'contractInterface'> & {
      chainId: string
    }
  ) =>
    fetch(
      `${config.ADAPTERS_HOST}/automates/ethereum/${variables.protocol}/${variables.contract}/${variables.chainId}`
    )
      .then((res) => res.json())
      .then((res) => ({
        address: res.address as string | undefined,
      })),

  getHistory: (variables: AutomationHistoryQueryVariables) =>
    getAPIClient()
      .query<AutomationHistoryQuery, AutomationHistoryQueryVariables>(
        AUTOMATION_HISTORY,
        variables
      )
      .toPromise()
      .then(({ data }) => ({
        list: data?.automateTrigger?.callHistory.list ?? [],
        count: data?.automateTrigger?.callHistory.pagination.count ?? 0,
      })),

  getProtocols: (variables: AutomationProtocolsQueryVariables) =>
    getAPIClient()
      .query<AutomationProtocolsQuery, AutomationProtocolsQueryVariables>(
        AUTOMATION_PROTOCOLS,
        variables
      )
      .toPromise()
      .then(({ data }) => data?.protocols.list ?? []),

  getDescription: () =>
    getAPIClient()
      .query<AutomationDescriptionQuery, AutomationDescriptionQuery>(
        AUTOMATION_DESCRIPTION
      )
      .toPromise()
      .then(({ data }) => data?.automateDescription),

  getProducts: (variables?: AutomationProductsQueryVariables) =>
    getAPIClient()
      .query<AutomationProductsQuery, AutomationProductsQueryVariables>(
        AUTOMATION_PRODUCTS,
        variables
      )
      .toPromise()
      .then(({ data }) => ({
        list: data?.products.list ?? [],
      })),

  getBalance: (variables?: AutomationProductsBalanceQueryVariables) =>
    getAPIClient()
      .query<
        AutomationProductsBalanceQuery,
        AutomationProductsBalanceQueryVariables
      >(AUTOMATION_PRODUCTS_BALANCE, variables)
      .toPromise()
      .then(({ data }) => data?.me?.store.balance.notifications ?? 0),
}
