import { gql } from '@urql/core'

import { USER_FRAGMENT } from './user.fragment.graphql'

export const AUTH_ETH = gql`
  mutation AuthEth(
    $input: AuthEthereumInputType!
    $filter: WalletListFilterInputType
    $sort: [WalletListSortInputType!]
    $pagination: WalletListPaginationInputType
  ) {
    authEth(input: $input) {
      user {
        ...userFragment
      }
      sid
    }
  }
  ${USER_FRAGMENT}
`
