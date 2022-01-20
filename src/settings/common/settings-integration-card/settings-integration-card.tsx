import clsx from 'clsx'

import React, { ReactElement } from 'react'
import { Paper } from '~/common/paper'
import { Typography } from '~/common/typography'
import { cutAccount } from '~/common/cut-account'
import * as styles from './settings-integration-card.css'
import { Button } from '~/common/button'

export type SettingsWalletCardProps = {
  className?: string
  icon: ReactElement
  account?: string
  platform: string
  onConnect: () => void
}

export const SettingsIntegrationCard: React.VFC<SettingsWalletCardProps> = (
  props
) => {
  const { icon, platform, account } = props
  return (
    <Paper className={clsx(styles.root, props.className)} radius={8}>
      <div className={styles.header}>
        <div className={styles.heading}>
          <div className={styles.icon}>{icon}</div>
          <Typography as="span">{platform}</Typography>
        </div>
        <div className={styles.row}>
          <Typography
            variant="body2"
            as="span"
            className={clsx(styles.infoTitle, styles.opacity)}
          >
            Account
          </Typography>
          <Typography variant="body2">
            {account ? cutAccount(account, 10) : 'none'}
          </Typography>
        </div>
      </div>

      <div className={clsx(styles.footer)}>
        <div className={styles.buttons}>
          <Button
            size="small"
            onClick={props.onConnect}
            className={account ? styles.disconnect : styles.connect}
          >
            {account ? 'Disconnect' : 'Connect'}
          </Button>
        </div>
      </div>
    </Paper>
  )
}
