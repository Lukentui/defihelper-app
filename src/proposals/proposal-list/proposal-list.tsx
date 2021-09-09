import { makeStyles } from '@material-ui/core'
import { useGate, useStore } from 'effector-react'
import { Link } from 'react-router-dom'

import { AppLayout } from '~/layouts'
import { paths } from '~/paths'
import { Can, userModel } from '~/users'
import { dateUtils } from '~/common/date-utils'
import { Paper } from '~/common/paper'
import { Button } from '~/common/button'
import { ProposalVote } from '../common'
import * as model from './proposal-list.model'

export type ProposalListProps = unknown

const useStyles = makeStyles(() => ({
  list: {
    listStyleType: 'none',
    padding: 0,
    margin: 0,
  },

  proposal: {
    display: 'flex',
  },

  link: {
    textDecoration: 'none',
    color: 'inherit',
    flexGrow: 1,

    '& > *': {
      height: '100%',
    },
  },
}))

export const ProposalList: React.VFC<ProposalListProps> = () => {
  const proposals = useStore(model.$proposalList)

  const loading = useStore(model.fetchProposalListFx.pending)

  const user = useStore(userModel.$user)

  useGate(model.ProposalListGate)

  const classes = useStyles()

  const handleVote = (proposalId: string) => () => {
    model.voteProposalFx(proposalId)
  }
  const handleUnvote = (proposalId: string) => () => {
    model.unvoteProposalFx({
      proposalId,
      userId: user?.id,
    })
  }

  const handleDelete = (proposalId: string) => () => {
    model.deleteProposalFx(proposalId)
  }

  return (
    <AppLayout>
      <Can I="create" a="Proposal">
        <Button
          as={Link}
          to={paths.proposals.create}
          variant="contained"
          color="primary"
        >
          New proposal
        </Button>
      </Can>
      {loading && <Paper>loading...</Paper>}
      {!loading && Boolean(proposals.length) && (
        <ul className={classes.list}>
          {proposals.map((proposal) => {
            const voted = proposal.votes.list?.some(
              (votes) => votes.user.id === user?.id
            )

            return (
              <li key={proposal.id} className={classes.proposal}>
                <ProposalVote
                  onUnvote={handleUnvote(proposal.id)}
                  onVote={handleVote(proposal.id)}
                  voted={voted}
                >
                  {proposal.votes.list?.length}
                </ProposalVote>
                <Paper
                  as={Link}
                  className={classes.link}
                  to={paths.proposals.detail(proposal.id)}
                >
                  <div>{proposal.title}</div>
                  <div>Posted {dateUtils.fromNow(proposal.createdAt)}</div>
                </Paper>
                <Can I="update" a="Proposal">
                  <Button
                    variant="contained"
                    color="primary"
                    as={Link}
                    to={paths.proposals.update(proposal.id)}
                  >
                    Edit
                  </Button>
                </Can>
                <Can I="delete" a="Proposal">
                  <Button
                    variant="contained"
                    color="secondary"
                    disabled={proposal.deleting}
                    onClick={handleDelete(proposal.id)}
                  >
                    Delete
                  </Button>
                </Can>
              </li>
            )
          })}
        </ul>
      )}
      {!loading && !proposals.length && <Paper>empty</Paper>}
      <model.ProposalListPagination />
    </AppLayout>
  )
}
