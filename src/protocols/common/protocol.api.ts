import { getAPIClient } from '~/api'
import {
  ProtocolCreateMutation,
  ProtocolCreateMutationVariables,
  ProtocolDeleteMutation,
  ProtocolDeleteMutationVariables,
  ProtocolQuery,
  ProtocolQueryVariables,
  ProtocolsQuery,
  ProtocolsQueryVariables,
  ProtocolUpdateMutation,
  ProtocolUpdateMutationVariables,
  ProtocolMetricQuery,
  ProtocolMetricQueryVariables,
  ProtocolFavoriteMutation,
  ProtocolFavoriteMutationVariables,
  ProtocolOverviewMetricQuery,
  ProtocolOverviewMetricQueryVariables,
  ProtocolEstimatedQuery,
  ProtocolEstimatedQueryVariables,
  ProtocolStakedBalanceQuery,
  ProtocolStakedBalanceQueryVariables,
} from '~/graphql/_generated-types'
import {
  PROTOCOLS,
  PROTOCOL_CREATE,
  PROTOCOL_DELETE,
  PROTOCOL_DETAIL,
  PROTOCOL_DETAIL_METRIC,
  PROTOCOL_ESTIMATED,
  PROTOCOL_FAVORITE,
  PROTOCOL_OVERVIEW_METRIC,
  PROTOCOL_STAKED_BALANCE,
} from './graphql'
import { PROTOCOL_UPDATE } from './graphql/protocol-update.graphql'

export const protocolsApi = {
  protocolList: (variables: ProtocolsQueryVariables) =>
    getAPIClient()
      .query<ProtocolsQuery, ProtocolsQueryVariables>(PROTOCOLS, variables, {
        requestPolicy: 'cache-and-network',
      })
      .toPromise()
      .then(({ data }) => ({
        list: data?.protocols.list ?? [],
        count: data?.protocols.pagination.count ?? 0,
        favorites: data?.favorites.pagination.count ?? 0,
        all: data?.all.pagination.count ?? 0,
      })),

  protocolDetail: (variables: ProtocolQueryVariables) =>
    getAPIClient()
      .query<ProtocolQuery, ProtocolQueryVariables>(PROTOCOL_DETAIL, variables)
      .toPromise()
      .then(({ data }) => data?.protocol),

  protocolDetailMetric: (variables: ProtocolMetricQueryVariables) =>
    getAPIClient()
      .query<ProtocolMetricQuery, ProtocolMetricQueryVariables>(
        PROTOCOL_DETAIL_METRIC,
        variables
      )
      .toPromise()
      .then(({ data }) => data?.protocol?.metricChartContracts ?? []),

  protocolOverviewMetric: (variables: ProtocolOverviewMetricQueryVariables) =>
    getAPIClient()
      .query<ProtocolOverviewMetricQuery, ProtocolOverviewMetricQueryVariables>(
        PROTOCOL_OVERVIEW_METRIC,
        variables
      )
      .toPromise()
      .then(({ data }) => ({
        tvl: data?.protocol?.tvl ?? [],
        uniqueWalletsCount: data?.protocol?.uniqueWalletsCount ?? [],
      })),

  protocolCreate: (variables: ProtocolCreateMutationVariables) =>
    getAPIClient()
      .mutation<ProtocolCreateMutation, ProtocolCreateMutationVariables>(
        PROTOCOL_CREATE,
        variables
      )
      .toPromise()
      .then(({ data }) => data?.protocolCreate),

  protocolUpdate: (variables: ProtocolUpdateMutationVariables) =>
    getAPIClient()
      .mutation<ProtocolUpdateMutation, ProtocolUpdateMutationVariables>(
        PROTOCOL_UPDATE,
        variables
      )
      .toPromise()
      .then(({ data }) => data?.protocolUpdate),

  protocolDelete: (id: string) =>
    getAPIClient()
      .mutation<ProtocolDeleteMutation, ProtocolDeleteMutationVariables>(
        PROTOCOL_DELETE,
        { id }
      )
      .toPromise()
      .then(({ data }) => data?.protocolDelete),

  protocolFavorite: (variables: ProtocolFavoriteMutationVariables) =>
    getAPIClient()
      .mutation<ProtocolFavoriteMutation, ProtocolFavoriteMutationVariables>(
        PROTOCOL_FAVORITE,
        variables
      )
      .toPromise()
      .then(({ data }) => data?.protocolFavorite),

  protocolEstimated: (variables: ProtocolEstimatedQueryVariables) =>
    getAPIClient()
      .query<ProtocolEstimatedQuery, ProtocolEstimatedQueryVariables>(
        PROTOCOL_ESTIMATED,
        variables
      )
      .toPromise()
      .then(({ data }) => data?.restakeStrategy),

  protocolStaked: (variables: ProtocolStakedBalanceQueryVariables) =>
    getAPIClient()
      .query<ProtocolStakedBalanceQuery, ProtocolStakedBalanceQueryVariables>(
        PROTOCOL_STAKED_BALANCE,
        variables
      )
      .toPromise()
      .then(({ data }) => ({
        altCoins: data?.me?.altCoins ?? [],
        stableCoins: data?.me?.stableCoins ?? [],
      })),
}
