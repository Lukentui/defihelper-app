import { useMemo, useState } from 'react'

import {
  BlockchainEnum,
  StakingContractFragmentFragment,
} from '~/graphql/_generated-types'
import { bignumberUtils } from '~/common/bignumber-utils'
import { Link } from '~/common/link'
import { ButtonBase } from '~/common/button-base/button-base'

export type StakingListRowSyncIndicatorProps = {
  row: StakingContractFragmentFragment & {
    syncedBlock: number
    scannerId?: string
  }
  currentBlock: number
  onContractRegister: () => void
}

const SCANNER_URL = 'https://scanner.defihelper.io/contract'

export const StakingListRowSyncIndicator: React.VFC<StakingListRowSyncIndicatorProps> =
  (props) => {
    const { row, currentBlock, onContractRegister } = props
    const [seemsUnusual, setSeemsUnusual] = useState(false)

    useMemo(
      () =>
        setSeemsUnusual(
          bignumberUtils.gt(
            bignumberUtils.minus(currentBlock, row.syncedBlock),
            100
          )
        ),
      [currentBlock, row.syncedBlock]
    )

    if (!row.deployBlockNumber || row.blockchain !== BlockchainEnum.Ethereum) {
      return <>not deployed</>
    }

    if (!row.scannerId) {
      return (
        <ButtonBase as={Link} onClick={onContractRegister}>
          register in scanner
        </ButtonBase>
      )
    }

    return (
      <Link
        href={`${SCANNER_URL}/${row.scannerId}`}
        target="_blank"
        rel="noreferrer"
        style={{
          color: seemsUnusual ? '#ff0000' : '#3eab3a',
        }}
      >
        {row.syncedBlock}/{currentBlock}
      </Link>
    )
  }
