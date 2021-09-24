import clsx from 'clsx'

import { ButtonBase } from '~/common/button-base'
import { Paper } from '~/common/paper'
import * as styles from './protocol-tabs.css'

export type ProtocolTabsProps = {
  className?: string
}

export const ProtocolTabs: React.VFC<ProtocolTabsProps> = (props) => {
  return (
    <Paper className={clsx(styles.root, props.className)}>
      <ButtonBase className={clsx(styles.tab, styles.active)}>
        Invested
      </ButtonBase>
      <ButtonBase className={styles.tab}>Favourite</ButtonBase>
      <ButtonBase className={styles.tab}>All</ButtonBase>
    </Paper>
  )
}
