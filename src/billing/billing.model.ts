import { createDomain, Effect, guard } from 'effector-logger'
import { nanoid } from 'nanoid'
import contracts from '@defihelper/networks/contracts.json'
import Balance from '@defihelper/networks/abi/Balance.json'
import { BigNumber, ethers } from 'ethers'
import { createGate } from 'effector-react'

import { networkModel } from '~/wallets/wallet-networks'
import { bignumberUtils } from '~/common/bignumber-utils'
import { toastsService } from '~/toasts'

type ChainIdEnum = keyof typeof contracts

const isChainId = (chainId: unknown): chainId is ChainIdEnum =>
  typeof chainId === 'string' && chainId in contracts

export const billingDomain = createDomain('billingDomain')

const createContract = () => {
  const { chainId, networkProvider, account } = networkModel.getNetwork()

  const chainIdString = String(chainId)

  if (!isChainId(chainIdString) || !networkProvider) {
    throw new Error('chainId does not support')
  }

  if (!account) {
    throw new Error('Account is required')
  }

  const contract = contracts[chainIdString]

  const balanceContract = new ethers.Contract(
    contract.Balance.address,
    Balance.abi,
    networkProvider.getSigner()
  )

  return {
    networkProvider,
    account,
    balanceContract,
  }
}

export const depositFx = billingDomain.createEffect({
  name: 'depositFx',
  handler: async (amount: string) => {
    const { networkProvider, account, balanceContract } = createContract()

    const amountNormalized = bignumberUtils.toSend(amount, 18)

    const balance = await networkProvider.getBalance(account)

    if (balance.lt(amountNormalized)) {
      throw new Error('not enough money')
    }

    const transactionReceipt = await balanceContract.deposit(account, {
      value: amountNormalized,
    })

    await transactionReceipt.wait()
  },
})

const createKeyStore = (name: string, event: Effect<string, void, Error>) =>
  billingDomain.createStore(name, { name }).on(event.doneData, () => nanoid())

export const $deposit = createKeyStore('$deposit', depositFx)

export const refundFx = billingDomain.createEffect({
  name: 'refundFx',
  handler: async (amount: string) => {
    const { account, balanceContract } = createContract()

    const amountNormalized = bignumberUtils.toSend(amount, 18)

    const balance = await balanceContract.netBalanceOf(account)

    if (balance.lt(amountNormalized)) {
      throw new Error('not enough money')
    }

    const transactionReceipt = await balanceContract.refund(amountNormalized)

    await transactionReceipt.wait()
  },
})

export const $refund = createKeyStore('$refund', refundFx)

toastsService.forwardErrors(refundFx.failData, depositFx.failData)

const fetchBalanceFx = billingDomain.createEffect({
  name: 'fetchBalanceFx',
  handler: () => {
    const { balanceContract, account } = createContract()

    return balanceContract.netBalanceOf(account) as Promise<BigNumber>
  },
})

export const $billingBalance = billingDomain
  .createStore<BigNumber | null>(null, {
    name: '$billingBalance',
  })
  .on(fetchBalanceFx.doneData, (_, payload) => payload)

export const BillingGate = createGate({
  domain: billingDomain,
  name: 'BillingGate',
})

guard({
  source: networkModel.$wallet,
  clock: [BillingGate.open, networkModel.$wallet],
  filter: ({ account, chainId }) => Boolean(account && chainId),
  target: fetchBalanceFx,
})

guard({
  source: networkModel.$wallet,
  clock: [refundFx.done, depositFx.done],
  filter: ({ account, chainId }) => Boolean(account && chainId),
  target: fetchBalanceFx,
})
