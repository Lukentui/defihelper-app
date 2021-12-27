import { createDomain, restore, sample } from 'effector-logger/macro'
import { createGate } from 'effector-react'

import { history } from '~/common/history'
import {
  ProtocolResolveContractsMutationVariables,
  ProtocolUpdateMutationVariables,
} from '~/graphql/_generated-types'
import { toastsService } from '~/toasts'
import { paths } from '~/paths'
import { protocolsApi } from '../common/protocol.api'
import { config } from '~/config'

const protocolUpdate = createDomain()

export const protocolUpdateFx = protocolUpdate.createEffect(
  (variables: ProtocolUpdateMutationVariables) =>
    protocolsApi.protocolUpdate(variables)
)

export const protocolResolveContractsFx = protocolUpdate.createEffect(
  (variables: ProtocolResolveContractsMutationVariables) =>
    protocolsApi.protocolResolveContracts(variables)
)

export const fetchAdaptersFx = protocolUpdate.createEffect(
  () =>
    fetch(config.ADAPTERS_HOST).then((res) => res.json()) as Promise<string[]>
)

export const $adapters = restore(fetchAdaptersFx.doneData, [])

export const ProtocolUpdateGate = createGate({
  name: 'ProtocolUpdateGate',
  domain: protocolUpdate,
})

sample({
  clock: ProtocolUpdateGate.open,
  target: fetchAdaptersFx,
})

protocolUpdateFx.doneData.watch((payload) => {
  if (!payload?.id) return

  history.push(paths.protocols.detail(payload.id))
})

toastsService.forwardErrors(protocolUpdateFx.failData)
