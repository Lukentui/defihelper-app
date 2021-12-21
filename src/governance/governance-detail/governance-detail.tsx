import clsx from 'clsx'
import React from 'react'
import { useGate, useStore } from 'effector-react'
import { useParams } from 'react-router-dom'

import { AppLayout } from '~/layouts'
import { Typography } from '~/common/typography'
import { MarkdownRender } from '~/common/markdown-render'
import { cutAccount } from '~/common/cut-account'
import { Link } from '~/common/link'
import { buildExplorerUrl } from '~/common/build-explorer-url'
import { config } from '~/config'
import {
  GovProposalStateEnum,
  GovReceiptSupportEnum,
} from '~/graphql/_generated-types'
import { dateUtils } from '~/common/date-utils'
import {
  GovernanceReasonDialog,
  GovernanceVoteInfo,
  GovProposalStateEnumColors,
} from '~/governance/common'
import { bignumberUtils } from '~/common/bignumber-utils'
import { Button } from '~/common/button'
import { isEthAddress } from '~/common/is-eth-address'
import { Chip } from '~/common/chip'
import { Paper } from '~/common/paper'
import { useDialog } from '~/common/dialog'
import { useWalletList } from '~/wallets/wallet-list'
import { Head } from '~/common/head'
import { switchNetwork } from '~/wallets/common'
import * as model from './governance-detail.model'
import * as styles from './governance-detail.css'

export type GovernanceDetailProps = unknown

const QUORUM_VOTES = '400000'

export const GovernanceDetail: React.VFC<GovernanceDetailProps> = () => {
  const params = useParams<{ governanceId: string }>()

  const [openGovernanceReasonDialog] = useDialog(GovernanceReasonDialog)
  const [openWalletList] = useWalletList()

  const loading = useStore(model.fetchGovernanceProposalFx.pending)
  const governanceDetail = useStore(model.$governanceDetail)
  const receipt = useStore(model.$receipt)

  useGate(model.GovernanceDetailGate, params.governanceId)

  const loadingQueue = useStore(model.queueFx.pending)
  const loadingExecute = useStore(model.executeFx.pending)

  const handleQueueProposal = async () => {
    try {
      const wallet = await openWalletList()

      await switchNetwork(String(config.DEFAULT_CHAIN_ID))

      if (!wallet.account) return

      model.queueFx({
        governanceId: Number(params.governanceId),
        account: wallet.account,
        chainId: String(wallet.chainId),
        provider: wallet.provider,
      })
    } catch (error) {
      if (error instanceof Error) {
        console.error(error.message)
      }
    }
  }
  const handleExecuteProposal = async () => {
    try {
      const wallet = await openWalletList()

      await switchNetwork(String(config.DEFAULT_CHAIN_ID))

      if (!wallet.account) return

      model.executeFx({
        governanceId: Number(params.governanceId),
        account: wallet.account,
        chainId: String(wallet.chainId),
        provider: wallet.provider,
      })
    } catch (error) {
      if (error instanceof Error) {
        console.error(error.message)
      }
    }
  }

  const loadingCastVote = useStore(model.castVoteFx.pending)

  const handleVoteFor = async () => {
    try {
      const wallet = await openWalletList()

      await switchNetwork(String(config.DEFAULT_CHAIN_ID))

      if (!wallet.account) return

      model.castVoteFx({
        proposalId: Number(params.governanceId),
        support: model.CastVotes.for,
        account: wallet.account,
        chainId: String(wallet.chainId),
        provider: wallet.provider,
      })
    } catch (error) {
      if (error instanceof Error) {
        console.error(error.message)
      }
    }
  }
  const handleVoteAbstain = async () => {
    try {
      const wallet = await openWalletList()

      await switchNetwork(String(config.DEFAULT_CHAIN_ID))

      if (!wallet.account) return

      const reason = await openGovernanceReasonDialog()

      model.castVoteFx({
        proposalId: Number(params.governanceId),
        support: model.CastVotes.abstain,
        reason,
        account: wallet.account,
        chainId: String(wallet.chainId),
        provider: wallet.provider,
      })
    } catch (error) {
      if (error instanceof Error) {
        console.error(error.message)
      }
    }
  }
  const handleVoteAgainst = async () => {
    try {
      const wallet = await openWalletList({
        blockchain: 'ethereum',
      })

      await switchNetwork(String(config.DEFAULT_CHAIN_ID))

      if (!wallet.account) return

      model.castVoteFx({
        proposalId: Number(params.governanceId),
        support: model.CastVotes.against,
        account: wallet.account,
        chainId: String(wallet.chainId),
        provider: wallet.provider,
      })
    } catch (error) {
      if (error instanceof Error) {
        console.error(error.message)
      }
    }
  }

  return (
    <AppLayout>
      <Head title={governanceDetail?.title} />
      {loading && <Typography>loading...</Typography>}
      {governanceDetail && (
        <div className={styles.root}>
          <Typography
            align="center"
            variant="h2"
            family="mono"
            transform="uppercase"
          >
            {governanceDetail.title}
          </Typography>
          <Chip
            color={GovProposalStateEnumColors[governanceDetail.state]}
            className={clsx(styles.status, styles.mb32)}
          >
            {governanceDetail.state}
          </Chip>
          {[
            GovProposalStateEnum.Defeated,
            GovProposalStateEnum.Executed,
            GovProposalStateEnum.Expired,
            GovProposalStateEnum.Succeeded,
          ].includes(governanceDetail.state) && (
            <div className={clsx(styles.voteInfo, styles.mb32)}>
              <GovernanceVoteInfo
                variant="for"
                active={receipt?.support === GovReceiptSupportEnum.For}
                total={bignumberUtils.total(
                  governanceDetail.abstainVotes,
                  governanceDetail.againstVotes,
                  governanceDetail.forVotes
                )}
                count={governanceDetail.forVotes}
              />
              <GovernanceVoteInfo
                variant="abstain"
                active={receipt?.support === GovReceiptSupportEnum.Abstain}
                total={bignumberUtils.total(
                  governanceDetail.abstainVotes,
                  governanceDetail.againstVotes,
                  governanceDetail.forVotes
                )}
                count={governanceDetail.abstainVotes}
              />
              <GovernanceVoteInfo
                variant="against"
                active={receipt?.support === GovReceiptSupportEnum.Against}
                total={bignumberUtils.total(
                  governanceDetail.abstainVotes,
                  governanceDetail.againstVotes,
                  governanceDetail.forVotes
                )}
                count={governanceDetail.againstVotes}
              />
            </div>
          )}
          {!bignumberUtils.gte(governanceDetail.forVotes, QUORUM_VOTES) && (
            <Typography
              variant="body1"
              align="center"
              as="div"
              className={styles.mb32}
            >
              In order to be applied, the quorum of 4% must be reached
            </Typography>
          )}
          {governanceDetail.state === GovProposalStateEnum.Active && !receipt && (
            <div className={clsx(styles.voteButtons, styles.mb32)}>
              <Button
                className={styles.voteButton}
                onClick={handleVoteFor}
                loading={loadingCastVote}
                color="green"
              >
                Vote for
              </Button>
              <Button
                className={styles.voteButton}
                onClick={handleVoteAbstain}
                loading={loadingCastVote}
              >
                Vote abstain
              </Button>
              <Button
                className={styles.voteButton}
                onClick={handleVoteAgainst}
                loading={loadingCastVote}
                color="red"
              >
                Vote against
              </Button>
            </div>
          )}
          {governanceDetail.state === GovProposalStateEnum.Succeeded && (
            <Button
              onClick={handleQueueProposal}
              loading={loadingQueue}
              className={styles.mb32}
            >
              Queue
            </Button>
          )}
          {dateUtils.after(
            dateUtils.now(),
            dateUtils.formatUnix(governanceDetail.eta, 'YYYY-MM-DD HH:mm:ss')
          ) &&
            governanceDetail.state === GovProposalStateEnum.Queued && (
              <Button
                onClick={handleExecuteProposal}
                loading={loadingExecute}
                className={styles.mb32}
              >
                Execute
              </Button>
            )}
          {governanceDetail.state === GovProposalStateEnum.Active && (
            <Typography align="center" className={styles.mb32}>
              Voting will end on{' '}
              {dateUtils.format(
                governanceDetail.endVoteDate,
                'DD MMMM YYYY HH:mm'
              )}
            </Typography>
          )}
          {governanceDetail.state === GovProposalStateEnum.Queued && (
            <Typography align="center" className={styles.mb32}>
              Can be executed on{' '}
              {dateUtils.formatUnix(governanceDetail.eta, 'DD MMMM YYYY HH:mm')}
            </Typography>
          )}
          <Paper className={clsx(styles.actions, styles.mb32)}>
            {governanceDetail.actions.map(
              ({ target, callDatas, signature, id }) => (
                <Typography key={id} className={styles.action} as="div">
                  <Link
                    href={buildExplorerUrl({
                      network: config.IS_DEV ? '3' : '1',
                      address: target,
                    })}
                    target="_blank"
                  >
                    {cutAccount(target)}
                  </Link>
                  .{signature}(
                  {callDatas.map((callData, index) => (
                    <React.Fragment key={String(index)}>
                      {isEthAddress(callData) ? (
                        <Link
                          href={buildExplorerUrl({
                            network: config.IS_DEV ? '3' : '1',
                            address: callData,
                          })}
                          target="_blank"
                        >
                          {cutAccount(callData)}
                        </Link>
                      ) : (
                        callData
                      )}
                      {callDatas.length - 1 === index ? '' : ', '}
                    </React.Fragment>
                  ))}
                  )
                </Typography>
              )
            )}
          </Paper>
          <Typography>
            Author:{' '}
            <Link
              href={buildExplorerUrl({
                network: config.IS_DEV ? '3' : '1',
                address: governanceDetail.proposer,
              })}
              target="_blank"
            >
              {cutAccount(governanceDetail.proposer)}
            </Link>
          </Typography>
          <MarkdownRender>{governanceDetail.description}</MarkdownRender>
        </div>
      )}
    </AppLayout>
  )
}
